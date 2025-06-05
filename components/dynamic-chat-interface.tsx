"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const ChatInterface = dynamic(
  () => import("@/components/chat-interface").then((m) => m.ChatInterface),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-4">
        <Skeleton className="w-full h-16 mb-4 max-w-2xl" />
        <Skeleton className="w-full h-[calc(100vh-280px)] max-w-2xl" />
        <Skeleton className="w-full h-24 mt-4 max-w-2xl" />
      </div>
    ),
  },
);

interface DynamicChatInterfaceProps {
  userId?: string;
  userImageUrl?: string;
}

export default function DynamicChatInterface({
  userId,
  userImageUrl,
}: DynamicChatInterfaceProps) {
  return <ChatInterface userId={userId} userImageUrl={userImageUrl} />;
}
