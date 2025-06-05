"use client";

import { useState, useRef, useEffect, KeyboardEvent, useCallback } from "react";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Copy,
  Check,
  SendHorizonal,
  Paperclip as PaperclipIcon,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { SignInButton } from "@clerk/nextjs";

interface ChatInterfaceProps {
  className?: string;
  userId?: string;
  userImageUrl?: string;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  attachment?: {
    name: string;
    size: number;
    type: string;
  };
}

interface ApiAttachment {
  mimeType: string;
  data: string; // Base64 encoded data
}

const MAX_MESSAGES = 40; // 20 pairs
const SESSION_STORAGE_KEY = "chatMessages_learnfunsl";
const SCROLL_THRESHOLD = 30; // Pixels from bottom to re-enable auto-scroll

const generateMessageId = () => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
};

export function ChatInterface({
  className,
  userId,
  userImageUrl,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    try {
      const storedMessages = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages) as Message[];
        setMessages(
          parsedMessages.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        );
      }
    } catch (error) {
      console.error("Error loading messages from session storage:", error);
    }
  }, []);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [chatLimitError, setChatLimitError] = useState<string | null>(null);
  const [attachmentsForApi, setAttachmentsForApi] = useState<ApiAttachment[]>(
    [],
  );

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null); // Ref for the ScrollArea's viewport
  const autoScrollEnabled = useRef<boolean>(true);
  const isMounted = useRef(true);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, []);

  useEffect(() => {
    if (autoScrollEnabled.current) {
      scrollToBottom();
    }
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (messages.length > 0) {
        try {
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(messages));
        } catch (error) {
          console.error(
            "[ChatInterface] Error saving messages to sessionStorage:",
            error,
          );
        }
      } else {
        // Clear sessionStorage if messages array becomes empty
        if (sessionStorage.getItem(SESSION_STORAGE_KEY)) {
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
      }
    }
  }, [messages]);

  useEffect(() => {
    const scrollViewport = chatContainerRef.current; // This should be the viewport of ScrollArea
    if (!scrollViewport) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollViewport;
      autoScrollEnabled.current =
        scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD;
    };

    scrollViewport.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollViewport.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!userId) {
      console.warn(
        "handleSendMessage called without a userId. This should be prevented by UI.",
      );
      // Optionally, trigger SignInButton programmatically if possible, or show a toast.
      // For now, relying on the SignInButton wrapper around the input area.
      return;
    }
    if (messages.length >= MAX_MESSAGES) {
      setChatLimitError("Chat limit reached. Please clear chat to continue.");
      return;
    }
    setChatLimitError(null);

    const trimmedInput = inputValue.trim();
    if ((!trimmedInput && !selectedFile) || isLoading) return;

    const currentInputForAI = trimmedInput; // Capture for AI response

    const newMessage: Message = {
      id: generateMessageId(),
      text: trimmedInput,
      sender: "user",
      timestamp: new Date(),
      // Display attachment info from selectedFile, actual data for API is in attachmentsForApi
      attachment: selectedFile
        ? {
            name: selectedFile.name,
            size: selectedFile.size,
            type: selectedFile.type,
          }
        : undefined,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setSelectedFile(null);
    setAttachmentsForApi([]); // Clear API attachments
    setFileError(null);
    // Reset file input value so the same file can be re-selected if removed and sent
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (inputRef.current) {
      // inputRef.current.value = ""; // Clearing is handled by setInputValue("")
      inputRef.current.focus();
    }
    setIsLoading(true);

    const aiResponseId = generateMessageId();
    // Add AI message placeholder
    const aiMessagePlaceholder: Message = {
      id: aiResponseId,
      text: "AI is thinking...", // Placeholder text
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessagePlaceholder]);

    try {
      // Prepare history just before the API call, excluding the new user message and AI placeholder
      const historyForAPI = messages
        .filter((msg) => msg.id !== newMessage.id) // Exclude current user message from history sent
        .map((msg) => ({ sender: msg.sender, text: msg.text }));

      const response = await fetch("/api/chat/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInputForAI,
          history: historyForAPI,
          attachments: attachmentsForApi, // Send processed attachments
        }),
      });

      if (!response.ok) {
        // Attempt to read error response as text, then JSON
        let errorText = "Failed to fetch stream.";
        try {
          const errorDataText = await response.text();
          try {
            const errorJson = JSON.parse(errorDataText);
            errorText = errorJson.error || errorDataText;
          } catch (e) {
            errorText = errorDataText;
          }
        } catch (e) {
          // Could not read text body
          console.error("Could not read error response body", e);
        }
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      const updateAIMessageChunk = (chunk: string) => {
        if (chunk && isMounted.current) {
          setMessages((prevMessages) =>
            prevMessages.map((msg) => {
              if (msg.id === aiResponseId) {
                const newText =
                  msg.text === "AI is thinking..." ? chunk : msg.text + chunk;
                return { ...msg, text: newText };
              }
              return msg;
            }),
          );
        }
      };

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: !done });
        updateAIMessageChunk(chunk);
      }
      // Ensure the decoder flushes any remaining multi-byte characters
      const finalChunk = decoder.decode();
      updateAIMessageChunk(finalChunk);
    } catch (error: any) {
      console.error("Failed to send message or fetch AI response:", error);
      if (isMounted.current) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === aiResponseId
              ? {
                  ...msg,
                  text: `Error: ${error.message || "Could not connect to AI"}`,
                }
              : msg,
          ),
        );
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    }
  }, [
    messages,
    inputValue,
    selectedFile,
    isLoading,
    attachmentsForApi,
    userId,
  ]);

  const handleInputKeyPress = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  const handleClearChat = useCallback(() => {
    setMessages([]);
    setInputValue("");
    setSelectedFile(null);
    setFileError(null);
    setChatLimitError(null);
    // sessionStorage is cleared by the useEffect hook for messages
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (fileInputRef.current) {
        // Reset to allow selecting the same file again if the user cancels and re-selects
        // This is also important if a file was selected, then removed, then user wants to re-select it.
        // However, we only want to do this if the event is from a fresh click, not if it's just clearing.
        // For simplicity, we'll reset it here, assuming it's a new selection attempt.
        // A more complex logic might be needed if we want to preserve the input value across modal closes without selection.
      }

      if (file) {
        if (file.size > 15 * 1024 * 1024) {
          // 15MB limit (adjust as needed for Gemini)
          setFileError("File is too large (max 15MB).");
          setSelectedFile(null);
          setAttachmentsForApi([]);
          if (fileInputRef.current) fileInputRef.current.value = ""; // Clear input on error
          return;
        }
        setSelectedFile(file);
        setFileError(null);

        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          const dataUrl = loadEvent.target?.result as string;
          if (dataUrl) {
            try {
              const parts = dataUrl.split(",");
              if (parts.length < 2) {
                console.error(
                  "Invalid Data URL format",
                  dataUrl.substring(0, 100),
                );
                throw new Error("Invalid Data URL format");
              }
              const mimeTypePart = parts[0].split(":")[1]?.split(";")[0];
              const base64Data = parts[1];
              if (!mimeTypePart || typeof base64Data === "undefined") {
                // Check if base64Data is undefined
                console.error(
                  "Could not parse Data URL parts. MimeType:",
                  mimeTypePart,
                  "Base64Data exists:",
                  typeof base64Data !== "undefined",
                );
                throw new Error("Could not parse Data URL parts");
              }
              setAttachmentsForApi([
                { mimeType: mimeTypePart, data: base64Data },
              ]);
            } catch (error) {
              console.error("Error processing file for API:", error);
              setFileError("Error processing file. Please try another.");
              setAttachmentsForApi([]);
              setSelectedFile(null);
              if (fileInputRef.current) fileInputRef.current.value = ""; // Clear input on error
            }
          }
        };
        reader.onerror = () => {
          console.error("FileReader error");
          setFileError("Could not read file. Please try again.");
          setAttachmentsForApi([]);
          setSelectedFile(null);
          if (fileInputRef.current) fileInputRef.current.value = ""; // Clear input on error
        };
        reader.readAsDataURL(file);
      } else {
        // This case handles when the file dialog is cancelled or no file is chosen.
        // We might not want to clear selectedFile here if a file was already selected and user just re-opened dialog and cancelled.
        // However, if event.target.files is empty, it means no file is currently selected from this input event.
        // For simplicity, if `file` is undefined, we clear everything related to a new selection.
        setSelectedFile(null);
        setAttachmentsForApi([]);
        // Do not clear fileInputRef.current.value here, as it might prevent re-selecting the same file if the dialog was cancelled.
      }
    },
    [],
  );

  const handleAttachmentClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleCopyToClipboard = useCallback(
    (text: string, messageId: string) => {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedMessageId(messageId);
        setTimeout(() => setCopiedMessageId(null), 2000);
      });
    },
    [],
  );

  return (
    <div
      className={cn(
        "flex flex-col bg-card text-foreground border rounded-lg shadow-lg w-full h-full max-h-[700px] md:max-h-[calc(100vh-8rem)]", // Adjusted height
        className,
      )}
    >
      <div className="flex items-center justify-between p-3 border-b shrink-0">
        <h2 className="text-lg font-semibold">Chat with AI</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClearChat}
          aria-label="Clear chat"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea
        className="flex-grow p-4 space-y-4"
        viewportRef={chatContainerRef} // Assign ref to viewport for scroll detection
      >
        {messages.map((msg) => (
          <ChatMessageBubble
            key={msg.id}
            msg={msg}
            userImageUrl={userImageUrl}
            handleCopyToClipboard={handleCopyToClipboard}
            copiedMessageId={copiedMessageId}
          />
        ))}

        {/* Invisible element to mark the end of messages for scrolling */}
        <div ref={messagesEndRef} className="h-0 w-0" />
      </ScrollArea>

      <div className="p-3 border-t-2 bg-card">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: "none" }}
          accept="image/*,application/pdf,.doc,.docx,.txt"
        />
        {selectedFile && (
          <div className="mb-2 text-sm text-muted-foreground">
            Attachment: {selectedFile?.name} (
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 h-auto py-0 px-1 text-red-500 hover:text-red-700"
              onClick={() => {
                setSelectedFile(null);
                setFileError(null);
              }}
            >
              Remove
            </Button>
          </div>
        )}
        {fileError && (
          <div className="mb-2 text-sm text-red-500">{fileError}</div>
        )}
        {chatLimitError && (
          <div className="mb-2 text-sm text-center text-red-500 font-semibold p-2 bg-red-50 border border-red-200 rounded-md">
            {chatLimitError}
          </div>
        )}
        {!userId ? (
          <div className="flex flex-col items-center gap-2 p-3 rounded-md border-2 border-dashed border-primary/30">
            <TextareaAutosize
              className="w-full bg-transparent outline-none resize-none px-3 py-3 rounded-md min-h-[45px] max-h-[100px] placeholder-muted-foreground text-center cursor-default"
              placeholder="Please sign in to start chatting with our AI assistant."
              readOnly
              minRows={2}
              value=""
            />
            <SignInButton mode="modal">
              <Button variant="default" size="lg" className="w-full sm:w-auto">
                Sign In to Chat
              </Button>
            </SignInButton>
          </div>
        ) : (
          // Original interactive input area for signed-in users
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-md"
              onClick={handleAttachmentClick}
              aria-label="Attach file"
            >
              <PaperclipIcon className="h-5 w-5" />
            </button>

            <div className="relative flex-1">
              <TextareaAutosize
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputKeyPress}
                className="w-full bg-background outline-none resize-none px-3 py-3 rounded-md min-h-[45px] max-h-[200px] focus:ring-2 focus:ring-primary/30"
                placeholder="Type your message or ask questions..."
                style={{ whiteSpace: "pre-wrap", lineHeight: "1.5" }}
                autoFocus
              />
            </div>

            <button
              className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSendMessage}
              disabled={isLoading || (!inputValue.trim() && !selectedFile)}
              aria-label="Send message"
            >
              <SendHorizonal className="h-5 w-5" />
            </button>
          </div>
        )}{" "}
        {/* This closing parenthesis and curly brace were effectively missing for the true branch of the ternary operator in the previous structure due to SignInButton wrapping logic */}
      </div>
    </div>
  );
}
