import { Star } from "lucide-react";

interface XpCounterProps {
  xp: number;
}

export const XpCounter = ({ xp }: XpCounterProps) => {
  return (
    <div className="flex items-center gap-1.5 cursor-pointer rounded-full bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-200 dark:hover:bg-amber-900">
      <Star className="size-4 fill-current text-amber-500" />
      <span>{xp.toLocaleString()}</span>
      <span className="font-normal">XP</span>
    </div>
  );
};
