"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Medal, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export function Leaderboard() {
  // Mock data
  const leaderboardData = [
    {
      rank: 1,
      name: "Amaya",
      xp: 12500,
      icon: <Crown className="w-5 h-5 text-yellow-500" />,
    },
    {
      rank: 2,
      name: "You",
      xp: 11800,
      icon: <Trophy className="w-5 h-5 text-gray-400" />,
    },
    {
      rank: 3,
      name: "Binara",
      xp: 11200,
      icon: <Medal className="w-5 h-5 text-orange-400" />,
    },
    { rank: 4, name: "Chathura", xp: 10500 },
    { rank: 5, name: "Dasun", xp: 9800 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="space-y-3"
        >
          {leaderboardData.map((player) => (
            <li
              key={player.rank}
              className={`flex items-center justify-between p-2 rounded-md ${
                player.name === "You" ? "bg-blue-100 dark:bg-blue-900/50" : ""
              }`}
            >
              <div className="flex items-center">
                <span className="font-bold w-6 text-center mr-2">
                  {player.rank}
                </span>
                <span className="font-medium">{player.name}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold mr-2">
                  {player.xp.toLocaleString()} XP
                </span>
                {player.icon}
              </div>
            </li>
          ))}
        </motion.ul>
      </CardContent>
    </Card>
  );
}
