import React from "react";
import { getCurrentUserXP } from "@/lib/actions/user.actions";

const XPDisplay = async () => {
  const { xp } = await getCurrentUserXP();

  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">
        XP:
      </span>
      <span className="font-bold text-sm text-primary">{xp}</span>
    </div>
  );
};

export default XPDisplay;
