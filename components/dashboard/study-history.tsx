"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, FileText } from "lucide-react";
import { motion } from "framer-motion";

export function StudyHistory() {
  // Mock data
  const historyData = [
    { type: "video", title: "Calculus Fundamentals", time: "2 days ago" },
    { type: "paper", title: "2021 Physics Paper", time: "3 days ago" },
    { type: "video", title: "Sri Lankan History: Part 1", time: "5 days ago" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study History</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          {historyData.map((item, index) => (
            <li key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                {item.type === "video" ? (
                  <Video className="w-5 h-5 mr-3 text-red-500" />
                ) : (
                  <FileText className="w-5 h-5 mr-3 text-blue-500" />
                )}
                <p>{item.title}</p>
              </div>
              <p className="text-sm text-muted-foreground">{item.time}</p>
            </li>
          ))}
        </motion.ul>
      </CardContent>
    </Card>
  );
}
