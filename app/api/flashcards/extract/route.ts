import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY_3;

const MODEL_NAME = "gemini-2.5-flash"; // Use a model that's good at JSON output

const a_instructions = `
You are an expert at processing educational text and extracting key information to create flashcards.
Your task is to analyze the user-provided text and generate a list of question-and-answer pairs.

Rules:
1.  **Output Format**: You MUST return the output as a valid JSON array of objects. Each object must have two keys: "front_text" (the question) and "back_text" (the answer).
    Example: [{"front_text": "What is the capital of France?", "back_text": "Paris"}, {"front_text": "What is 2 + 2?", "back_text": "4"}]
2.  **Clarity**: Questions should be clear and concise.
3.  **Accuracy**: Answers must be accurate based on the provided text.
4.  **Relevance**: Only extract information that is suitable for a flashcard format. Ignore conversational text or irrelevant details.
5.  **No Hallucination**: If the text is nonsensical or you cannot extract valid Q&A pairs, return an empty array: [].
6.  **Simplicity**: Focus on direct relationships between terms and definitions, concepts and explanations, or questions and their direct answers within the text.
`;

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "AI service not configured." },
      { status: 500 },
    );
  }

  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide sufficient text to analyze." },
        { status: 400 },
      );
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: a_instructions,
    });

    const generationConfig = {
      temperature: 0.2,
      topK: 1,
      topP: 1,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    };

    const prompt = `Here is the text to analyze:\n\n---\n${text}\n---\n\nPlease extract the flashcard data as a JSON array.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const jsonText = response.text();

    // Basic validation to ensure the response is likely a JSON array
    if (jsonText.trim().startsWith("[") && jsonText.trim().endsWith("]")) {
      return NextResponse.json(JSON.parse(jsonText));
    } else {
      console.error("Gemini did not return a valid JSON array:", jsonText);
      return NextResponse.json(
        {
          error:
            "Failed to process text with AI. The model returned an unexpected format.",
        },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("Error in AI extraction route:", error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 },
    );
  }
}
