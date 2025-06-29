"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, ShieldCheck, Star } from "lucide-react";
import { motion } from "framer-motion";

export function GamificationSummary() {
  // Mock data
  const gamificationData = {
    level: 12,
    badges: [
      {
        name: "Perfect Week",
        icon: <ShieldCheck className="w-8 h-8 text-green-500" />,
      },
      { name: "Math Whiz", icon: <Star className="w-8 h-8 text-yellow-500" /> },
      {
        name: "Quick Learner",
        icon: <Badge className="w-8 h-8 text-purple-500" />,
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">Current Level</p>
            <p className="text-4xl font-bold">{gamificationData.level}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Badges Unlocked</h4>
            <div className="grid grid-cols-3 gap-4">
              {gamificationData.badges.map((badge) => (
                <div
                  key={badge.name}
                  className="flex flex-col items-center text-center p-2 bg-secondary/50 rounded-lg"
                >
                  {badge.icon}
                  <p className="text-xs mt-1 truncate w-full">{badge.name}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
