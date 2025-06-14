import { useEffect } from "react";

type ShortcutsConfig = {
  flip?: () => void;
  nextCard?: (rating?: "again" | "good" | "easy") => void;
  previousCard?: () => void;
  pause?: () => void;
  enabled: boolean;
};

export function useKeyboardShortcuts({
  flip,
  nextCard,
  previousCard,
  pause,
  enabled,
}: ShortcutsConfig) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case " ": // Spacebar
          event.preventDefault();
          flip?.();
          break;
        case "ArrowRight":
          nextCard?.("good");
          break;
        case "ArrowLeft":
          previousCard?.();
          break;
        case "1":
          nextCard?.("again");
          break;
        case "2":
          nextCard?.("good");
          break;
        case "3":
          nextCard?.("easy");
          break;
        case "p":
          pause?.();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [flip, nextCard, previousCard, pause, enabled]);
}
