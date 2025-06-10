"use client";

import { motion } from "framer-motion";

// A simple counter component for animating numbers
function Counter({ value }: { value: number }) {
  // This would ideally use a more sophisticated animation library
  // or framer-motion's useSpring for a smoother effect.
  // For simplicity, we'll just display the value.
  return (
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {value}
    </motion.span>
  );
}

export function ProgressDashboard({ userProgress }: { userProgress: any }) {
  const { current_streak = 0, total_cards_studied = 0 } = userProgress || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Streak Card */}
      <motion.div
        className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center justify-center text-center"
        whileHover={{ y: -5 }}
      >
        <div className="text-6xl mb-2">🔥</div>
        <div className="text-4xl font-bold">
          <Counter value={current_streak} />
        </div>
        <p className="text-muted-foreground">Day Streak</p>
      </motion.div>

      {/* Total Cards Studied Card */}
      <motion.div
        className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center justify-center text-center"
        whileHover={{ y: -5 }}
      >
        <div className="text-4xl font-bold">
          <Counter value={total_cards_studied} />
        </div>
        <p className="text-muted-foreground">Total Cards Studied</p>
      </motion.div>

      {/* More stats can be added here */}
    </div>
  );
}
