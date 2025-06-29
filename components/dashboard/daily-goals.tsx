"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import { motion } from "framer-motion";

export function DailyGoals() {
  // Mock data
  const goalData = {
    current: 35,
    goal: 50,
  };
  const percentage = Math.round((goalData.current / goalData.goal) * 100);
  const chartData = [{ name: "XP", value: percentage }];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center text-center"
        >
          <div style={{ width: "100%", height: 150 }}>
            <ResponsiveContainer>
              <RadialBarChart
                innerRadius="70%"
                outerRadius="85%"
                data={chartData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={10}
                  fill="#3b82f6"
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-2xl font-bold fill-current"
                >
                  {`${percentage}%`}
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-lg font-medium">
            {goalData.current} / {goalData.goal} XP
          </p>
          <p className="text-sm text-muted-foreground">Keep going!</p>
        </motion.div>
      </CardContent>
    </Card>
  );
}
