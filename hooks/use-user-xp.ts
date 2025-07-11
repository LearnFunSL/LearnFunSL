import { useEffect } from "react";
import { useXpStore } from "@/store/xp-store";

export const useUserXp = (initialXp: number) => {
  const { xp, setXp } = useXpStore();

  // Set the initial value in the store only once.
  useEffect(() => {
    if (initialXp !== 0) {
      setXp(initialXp);
    }
  }, [initialXp, setXp]);

  return xp;
};
