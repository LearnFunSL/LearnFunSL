import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

export function StudyHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Study History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-40 text-center">
          <History className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold">Coming Soon!</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Your recent activity will be tracked here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
