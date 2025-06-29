"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Star, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export function QuickOverview() {
  // Mock data - will be replaced with data from Supabase
  const overviewData = {
    dailyStreak: 5,
    xpPoints: 1250,
    nextRecommended: "Introduction to Algebra",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center"
        >
          <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-lg">
            <Flame className="w-8 h-8 text-orange-500 mb-2" />
            <p className="text-2xl font-bold">{overviewData.dailyStreak}</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-lg">
            <Star className="w-8 h-8 text-yellow-500 mb-2" />
            <p className="text-2xl font-bold">{overviewData.xpPoints}</p>
            <p className="text-sm text-muted-foreground">XP Points</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-lg">
            <BookOpen className="w-8 h-8 text-blue-500 mb-2" />
            <p className="font-semibold truncate w-full">
              {overviewData.nextRecommended}
            </p>
            <p className="text-sm text-muted-foreground">Next Up</p>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
