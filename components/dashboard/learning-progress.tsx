import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";

export function LearningProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-center">
          <BarChart2 className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold">Coming Soon!</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Track your progress by subject here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
