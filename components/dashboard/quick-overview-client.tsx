"use client";

import { Star } from "lucide-react";
import { useUserXp } from "@/hooks/use-user-xp";

interface QuickOverviewClientProps {
  initialXp: number;
}

export function QuickOverviewClient({ initialXp }: QuickOverviewClientProps) {
  const totalXp = useUserXp(initialXp);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-secondary/50 rounded-lg">
      <Star className="w-10 h-10 text-yellow-500 mb-2" />
      <p className="text-3xl font-bold">{totalXp.toLocaleString()}</p>
      <p className="text-sm text-muted-foreground">Total XP Points</p>
    </div>
  );
}
