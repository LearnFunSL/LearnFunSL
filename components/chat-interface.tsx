"use client";

import { useState, useRef, useEffect, KeyboardEvent, useCallback } from "react";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Copy, Check, SendHorizonal, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignInButton } from "@clerk/nextjs";
import { awardXP } from "@/lib/actions/xp.actions";

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
}

const SESSION_STORAGE_KEY = "chatMessages_learnfunsl";
const SCROLL_THRESHOLD = 30;

const generateMessageId = () => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
};

export function ChatInterface({
  className,
  userId,
  userImageUrl,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollEnabled = useRef<boolean>(true);
  const isMounted = useRef(true);

  const handleScroll = () => {
    const scrollViewport = chatContainerRef.current;
    if (!scrollViewport) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollViewport;
    autoScrollEnabled.current =
      scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD;
  };

  const handleCopyToClipboard = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const scrollToBottom = useCallback(() => {
    if (autoScrollEnabled.current) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

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
      console.error("Error loading messages:", error);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(messages));
    } else {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading || !userId) return;

    // Award XP for using the AI Help feature
    awardXP("AI_HELP").then((result) => {
      if (!result.success) {
        console.error("Failed to award XP for AI Help:", result.error);
      }
    });

    const newMessage: Message = {
      id: generateMessageId(),
      text: trimmedInput,
      sender: "user",
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    const aiResponseId = generateMessageId();
    setMessages((prev) => [
      ...prev,
      {
        id: aiResponseId,
        text: "AI is thinking...",
        sender: "ai",
        timestamp: new Date(),
      },
    ]);

    try {
      const response = await fetch("/api/chat/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmedInput,
          history: updatedMessages.slice(0, -1),
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to get response from AI.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
        if (isMounted.current) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiResponseId ? { ...m, text: fullResponse } : m,
            ),
          );
        }
      }
    } catch (error: any) {
      if (isMounted.current) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiResponseId
              ? { ...m, text: `Error: ${error.message}` }
              : m,
          ),
        );
      }
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, [inputValue, isLoading, userId, messages]);

  const handleInputKeyPress = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-card text-foreground border rounded-lg shadow-lg",
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
      <div className="flex-1 min-h-0">
        <ScrollArea
          className="h-full"
          viewportRef={chatContainerRef}
          onScroll={handleScroll}
        >
          <div className="p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-3",
                  msg.sender === "user" && "justify-end",
                )}
              >
                {msg.sender === "ai" && (
                  <Avatar className="w-8 h-8 border">
                    <Image
                      src="/learnfunsl-ai-logo.svg"
                      alt="AI Avatar"
                      width={32}
                      height={32}
                    />
                  </Avatar>
                )}
                <ChatMessageBubble
                  message={msg}
                  onCopy={() => handleCopyToClipboard(msg.text, msg.id)}
                  isCopied={copiedMessageId === msg.id}
                />
                {msg.sender === "user" && (
                  <Avatar className="w-8 h-8 border">
                    <AvatarImage src={userImageUrl} alt="User Avatar" />
                    <AvatarFallback>{userId ? "U" : "?"}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
      <div className="p-3 border-t-2 bg-card">
        {!userId ? (
          <div className="flex flex-col items-center gap-2">
            <TextareaAutosize
              className="w-full text-center bg-transparent resize-none"
              readOnly
              value="Please sign in to start chatting."
            />
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <TextareaAutosize
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyPress}
              className="w-full bg-background outline-none resize-none px-3 py-3 rounded-md min-h-[45px] max-h-[200px] focus:ring-2 focus:ring-primary/30"
              placeholder="Type your message..."
              autoFocus
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              aria-label="Send message"
            >
              <SendHorizonal className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
