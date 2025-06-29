"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "Mon", xp: 40 },
  { name: "Tue", xp: 60 },
  { name: "Wed", xp: 50 },
  { name: "Thu", xp: 80 },
  { name: "Fri", xp: 70 },
  { name: "Sat", xp: 110 },
  { name: "Sun", xp: 150 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg shadow-lg">
        <p className="label font-semibold text-foreground">{`${label}`}</p>
        <p className="intro text-blue-600 dark:text-blue-400">{`XP Gained: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

export function ProgressChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Weekly XP Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <AreaChart
                data={data}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border/50"
                />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "hsla(var(--accent), 0.2)" }}
                />
                <Area
                  type="monotone"
                  dataKey="xp"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorXp)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
