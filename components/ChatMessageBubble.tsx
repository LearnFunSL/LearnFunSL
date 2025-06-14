"use client";

import React, { memo, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
// Import the CSS in a layout or global CSS file instead
// import 'katex/dist/katex.min.css';

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
}

interface ChatMessageBubbleProps {
  message: Message;
  onCopy: () => void;
  isCopied: boolean;
}

// Check if content contains math expressions
const containsMath = (content: string): boolean => {
  // Look for inline math $...$ or block math $$...$$
  const inlineMathRegex = /\$[^$\n]+\$/g;
  const blockMathRegex = /\$\$[\s\S]+?\$\$/g;
  // Look for LaTeX commands like \frac{}{}, \div, \times
  const latexCommandRegex = /\\(frac|div|times|cdot|sqrt|alpha|beta|sum|int)/g;

  return (
    inlineMathRegex.test(content) ||
    blockMathRegex.test(content) ||
    latexCommandRegex.test(content)
  );
};

// Simple markdown rendering without math support
const SimpleMarkdown = memo(
  ({ content, isUser }: { content: string; isUser: boolean }) => (
    <div
      className={cn(
        "prose prose-sm max-w-none",
        isUser ? "text-white" : "dark:prose-invert",
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  ),
);
SimpleMarkdown.displayName = "SimpleMarkdown";

// Full markdown rendering with math support (heavier)
const MathMarkdown = memo(
  ({ content, isUser }: { content: string; isUser: boolean }) => (
    <div
      className={cn(
        "prose prose-sm max-w-none",
        isUser ? "text-white" : "dark:prose-invert",
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {content}
      </ReactMarkdown>
    </div>
  ),
);
MathMarkdown.displayName = "MathMarkdown";

export function ChatMessageBubble({
  message,
  onCopy,
  isCopied,
}: ChatMessageBubbleProps) {
  const isUser = message.sender === "user";

  // Determine if message has math content (memoized)
  const hasMath = useMemo(() => containsMath(message.text), [message.text]);

  return (
    <div
      className={cn(
        "group relative rounded-lg pl-3 pr-8 py-2 max-w-[calc(100%-40px)] break-words",
        isUser ? "bg-primary text-primary-foreground" : "bg-muted",
      )}
    >
      {hasMath ? (
        <MathMarkdown content={message.text} isUser={isUser} />
      ) : (
        <SimpleMarkdown content={message.text} isUser={isUser} />
      )}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity",
          isUser
            ? "text-primary-foreground hover:bg-primary/80"
            : "text-muted-foreground hover:bg-muted/80",
          isCopied && "opacity-100",
        )}
        onClick={onCopy}
        aria-label={isCopied ? "Copied" : "Copy message"}
      >
        {isCopied ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </Button>
    </div>
  );
}

export default memo(ChatMessageBubble);
