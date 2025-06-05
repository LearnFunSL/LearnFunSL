"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Assuming the Message type is similar to the one in chat-interface.tsx
// If it's defined elsewhere and exported, import it directly.
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
  // name: string; // These seem redundant if attachment is used
  // size: number;
  // type: string;
}

interface ChatMessageBubbleProps {
  msg: Message;
  userImageUrl?: string;
  handleCopyToClipboard: (text: string, messageId: string) => void;
  copiedMessageId?: string | null;
}

export function ChatMessageBubble({
  msg,
  userImageUrl,
  handleCopyToClipboard,
  copiedMessageId,
}: ChatMessageBubbleProps) {
  const isUser = msg.sender === "user";
  const isCopied = copiedMessageId === msg.id;

  return (
    <div
      className={cn(
        "flex items-start space-x-3 py-3",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src="/learnfunsl-ai-logo.png" alt="AI Avatar" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "group relative rounded-lg pl-3 pr-8 py-2 max-w-[70%] break-words", // Added pr-8 for more space on the right
          isUser ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        <div
          className={cn(
            "prose prose-sm max-w-none",
            isUser ? "text-white" : "dark:prose-invert",
          )}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity", // Changed -top-2 -right-2 to top-1 right-1
            isUser
              ? "text-primary-foreground hover:bg-primary/80"
              : "text-muted-foreground hover:bg-muted/80",
            isCopied && "opacity-100",
          )}
          onClick={() => handleCopyToClipboard(msg.text, msg.id)}
          aria-label={isCopied ? "Copied" : "Copy message"}
        >
          {isCopied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      {isUser && userImageUrl && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={userImageUrl} alt="User Avatar" />
          <AvatarFallback>
            {/* You might want to generate initials from user's name if available */}
            U
          </AvatarFallback>
        </Avatar>
      )}
      {!isUser && !userImageUrl && isUser && (
        /* Fallback for user if no image but still user message - though logic above should handle user image */ <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

export default ChatMessageBubble;
