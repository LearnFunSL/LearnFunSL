// app/api/chat/gemini/route.ts
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY_1 = process.env.GEMINI_API_KEY_1;
const GEMINI_API_KEY_2 = process.env.GEMINI_API_KEY_2;

// --- BEGIN CUSTOM INSTRUCTIONS ---
// Replace this with your actual custom instructions for the Gemini model
const CUSTOM_SYSTEM_INSTRUCTIONS = `
LearnFunSL - Custom AI Instructions
Core Identity
You are LearnFunSL, a warm, professional AI assistant modeled after a trusted Sri Lankan school teacher. Support students from Grades 1-13 across the National Curriculum with expertise in both English and Tamil.
🎓 Subject Expertise & Teaching Approach
Academic Coverage

Core Subjects: Mathematics, Science, Languages (English, Tamil, Sinhala), History, Geography, ICT, Commerce, Art, Music, Physical Education, Information Technology, Business Studies, and Life Skills.
Grade-Responsive: Automatically adjust explanation depth, vocabulary, and examples to match the student's grade level
Curriculum-Aligned: Ensure all content follows Sri Lankan National Curriculum standards

Teaching Methodology

Supportive Tone: Patient, encouraging, and motivating approach
Step-by-Step Breakdown: Complex topics divided into digestible parts
Cultural Relevance: Use local examples and contexts when appropriate

🌐 Language Management
Primary Rule
CRITICAL: Always respond in the current interface language
Language Switching Logic

If user's most recent message is clearly in the opposite language → switch for that response only
Use simple, clear vocabulary with age-appropriate explanations

📚 Platform Integration & Navigation
In-App Guidance
Help students navigate EduHelpSL features:

Library Access: Textbooks, Past Papers, Additional Materials
Video Navigation: Grade → Subject → Unit structure
Study Planning: Recommend relevant sections based on queries

🧾 File Handling Protocol
Upload Response
When users upload PDFs/images:

Acknowledge: "Based on the [file type] you shared about [topic]..."
Connect: Relate file context to their specific question

📝 Academic Integrity Policy
Essay Writing Approach
DO NOT provide complete essays in any language.
Instead, provide:

Topic overview and key themes
4-5 main points for development
Structural guidance (introduction → body → conclusion)
Research direction suggestions

Reasoning
Maintains academic integrity while building independent writing skills.
🧠 Communication Standards
Response Format

Concise & Helpful: Direct answers without unnecessary elaboration
Basic Markdown Only:

Bold for key terms/steps
* for bullet points
1. for sequential steps
Good paragraph spacing
# Headings
tables

Avoid: code blocks

Tone Consistency

Professional yet approachable
Age-appropriate language
Encouraging and patient
Culturally sensitive

### Don't be afraid to answer vast variety of questions the students might have that are not related to the subject matter. 

always praise student's creative thinknig and innovative ideas, and not just school curriculum. encourage students to think out of the box and come up with creative solutions to problems. if they ask you questions that are not related to the subject matter, try to answer them in a way that is helpful to them to learn more about it and find their passion.
encourage them if they ask about modern topics like AI, blockchain, coding, and basic life skills, etc.
but don't go too far out from your main purpose of helping students with their schoolwork. and don't get into topics like sex, and inappropriate topics.

Identity Consistency
Never reference: "I am a large language model developed by [company]"
Always say: "I am your AI tutor here to help with your schoolwork"
      
`;

const MODEL_NAME = "gemini-2.5-flash-preview-05-20";

interface Attachment {
  mimeType: string;
  data: string; // Base64 encoded data
}

async function* streamGeminiResponse(
  apiKey: string | undefined,
  userMessage: string,
  chatHistory: { role: string; parts: { text: string }[] }[],
  attachments?: Attachment[],
): AsyncIterable<string> {
  if (!apiKey) {
    throw new Error("Gemini API key is missing.");
  }

  // Use the specific model name from the constant
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:streamGenerateContent?key=${apiKey}&alt=sse`;

  const userParts: any[] = [{ text: userMessage }];
  if (attachments && attachments.length > 0) {
    attachments.forEach((attachment) => {
      userParts.push({
        inlineData: {
          mimeType: attachment.mimeType,
          data: attachment.data,
        },
      });
    });
  }
  const contents = [...chatHistory, { role: "user", parts: userParts }];

  // Note: CUSTOM_SYSTEM_INSTRUCTIONS integration with direct REST API needs careful handling.
  // It might be part of the 'contents' array as the first message, or a separate 'systemInstruction' field.
  // Example: Prepending system instructions to contents if not already handled:
  // if (CUSTOM_SYSTEM_INSTRUCTIONS && (contents.length === 0 || contents[0].role !== 'system')) {
  //   contents.unshift({ role: 'system', parts: [{ text: CUSTOM_SYSTEM_INSTRUCTIONS }] });
  // }
  // For now, assuming chatHistory and userMessage are primary. Review if system prompt is missing.

  const generationConfig = {
    temperature: 0.5,
    topK: 32,
    topP: 0.9,
    maxOutputTokens: 16000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const requestBody = {
    contents: contents,
    generationConfig: generationConfig,
    safetySettings: safetySettings,
    systemInstruction: { parts: [{ text: CUSTOM_SYSTEM_INSTRUCTIONS }] },
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", response.status, errorText);
      throw new Error(
        `Gemini API request failed with status ${response.status}: ${errorText}`,
      );
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      buffer += decoder.decode(value, { stream: true });

      let eolIndex;
      // SSE streams use \r\n or \n as line terminators. Robustly handle both.
      while ((eolIndex = buffer.indexOf("\n")) >= 0) {
        let line = buffer.substring(0, eolIndex);
        buffer = buffer.substring(eolIndex + 1);
        if (line.endsWith("\r")) {
          line = line.substring(0, line.length - 1);
        }
        line = line.trim();

        if (line.startsWith("data: ")) {
          const jsonString = line.substring(5).trim(); // Remove "data: " prefix
          if (jsonString === "[DONE]" || jsonString.length === 0) {
            // Some streams might send a [DONE] marker or an empty data line
            continue; // Skip empty data lines or [DONE] marker
          }
          try {
            const parsed = JSON.parse(jsonString);
            if (parsed.candidates && parsed.candidates.length > 0) {
              const candidate = parsed.candidates[0];
              if (
                candidate.content &&
                candidate.content.parts &&
                candidate.content.parts.length > 0
              ) {
                const textPart = candidate.content.parts[0].text;
                if (textPart) {
                  // Yield even if it's an empty string, let consumer decide
                  yield textPart;
                }
              }
            }
          } catch (e) {
            console.warn(
              "Failed to parse JSON chunk from Gemini stream:",
              jsonString,
              e,
            );
          }
        }
      }
    }
    // Process any remaining buffer content if the stream ends without a final newline
    if (buffer.startsWith("data: ")) {
      const jsonString = buffer.substring(5).trim();
      if (jsonString.length > 0 && jsonString !== "[DONE]") {
        try {
          const parsed = JSON.parse(jsonString);
          if (parsed.candidates && parsed.candidates.length > 0) {
            const candidate = parsed.candidates[0];
            if (
              candidate.content &&
              candidate.content.parts &&
              candidate.content.parts.length > 0
            ) {
              const textPart = candidate.content.parts[0].text;
              if (textPart) {
                yield textPart;
              }
            }
          }
        } catch (e) {
          console.warn(
            "Failed to parse final JSON chunk from Gemini stream:",
            jsonString,
            e,
          );
        }
      }
    }
  } catch (error) {
    console.error("Error in streamGeminiResponse (fetch):", error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message, history, attachments } = await req.json();

    if (attachments && attachments.length > 0) {
      attachments.forEach((att: Attachment, index: number) => {});
    } else {
    }

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // Ensure history is correctly formatted for the Gemini API
    const formattedHistory = history.map(
      (msg: {
        sender: string;
        text: string;
        timestamp?: Date;
        id?: string;
      }) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }),
    );

    let apiKeyToUse: string | undefined = undefined;
    let apiKeyName = "";

    if (GEMINI_API_KEY_1) {
      apiKeyToUse = GEMINI_API_KEY_1;
      apiKeyName = "GEMINI_API_KEY_1";
    } else if (GEMINI_API_KEY_2) {
      apiKeyToUse = GEMINI_API_KEY_2;
      apiKeyName = "GEMINI_API_KEY_2";
    } else {
      console.error("No Gemini API keys configured.");
      return NextResponse.json(
        { error: "AI service not configured." },
        { status: 500 },
      );
    }

    try {
      console.log(`Attempting to use ${apiKeyName} for streaming response`);
      const geminiStreamIterable = streamGeminiResponse(
        apiKeyToUse,
        message,
        formattedHistory,
        attachments,
      );
      const encoder = new TextEncoder();
      const readableStream = new ReadableStream({
        async start(controller) {
          for await (const chunk of geminiStreamIterable) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        },
      });
      return new Response(readableStream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    } catch (error: any) {
      console.warn(`${apiKeyName} streaming attempt failed:`, error.message);
      // If primary key failed and secondary key exists, try secondary key
      if (apiKeyName === "GEMINI_API_KEY_1" && GEMINI_API_KEY_2) {
        apiKeyToUse = GEMINI_API_KEY_2;
        apiKeyName = "GEMINI_API_KEY_2";
        console.log(
          `Attempting to use ${apiKeyName} for streaming response as fallback`,
        );
        try {
          const fallbackGeminiStreamIterable = streamGeminiResponse(
            apiKeyToUse,
            message,
            formattedHistory,
            attachments,
          );
          const encoder = new TextEncoder();
          const readableFallbackStream = new ReadableStream({
            async start(controller) {
              for await (const chunk of fallbackGeminiStreamIterable) {
                controller.enqueue(encoder.encode(chunk));
              }
              controller.close();
            },
          });
          return new Response(readableFallbackStream, {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        } catch (fallbackError: any) {
          console.error(
            `${apiKeyName} (fallback) streaming attempt also failed:`,
            fallbackError.message,
          );
          return NextResponse.json(
            {
              error: `Both API keys failed. Last error: ${fallbackError.message}`,
            },
            { status: 500 },
          );
        }
      }
      // If it was already the secondary key or no secondary key, then fail
      return NextResponse.json(
        { error: `API key ${apiKeyName} failed. ${error.message}` },
        { status: 500 },
      );
    }
  } catch (error: any) {
    // Catch errors from req.json() or other general errors
    console.error("Error in Gemini API route handler:", error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 },
    );
  }
}
