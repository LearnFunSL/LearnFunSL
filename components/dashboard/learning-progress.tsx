"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

export function LearningProgress() {
  // Mock data
  const progressData = [
    { subject: "Mathematics", progress: 75, color: "#3b82f6" },
    { subject: "Science", progress: 60, color: "#22c55e" },
    { subject: "History", progress: 45, color: "#eab308" },
    { subject: "English", progress: 85, color: "#ef4444" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ width: "100%", height: 300 }}
        >
          <ResponsiveContainer>
            <BarChart
              data={progressData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis
                dataKey="subject"
                type="category"
                tickLine={false}
                axisLine={false}
              />
              <Tooltip cursor={{ fill: "rgba(200, 200, 200, 0.1)" }} />
              <Bar dataKey="progress" barSize={20} radius={[0, 10, 10, 0]}>
                {progressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  );
}
