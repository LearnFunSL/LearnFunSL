import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { Crown, Medal, Trophy } from "lucide-react";

const rankIcons: { [key: number]: React.ReactNode } = {
  1: <Crown className="w-5 h-5 text-yellow-500" />,
  2: <Trophy className="w-5 h-5 text-gray-400" />,
  3: <Medal className="w-5 h-5 text-orange-400" />,
};

export async function Leaderboard() {
  const supabase = createSupabaseServerClient();
  const { userId } = await auth();

  const { data: topUsers, error: topUsersError } = await supabase
    .from("users")
    .select("clerk_id, username, xp_total")
    .order("xp_total", { ascending: false })
    .limit(5);

  if (topUsersError) {
    console.error("Error fetching leaderboard:", topUsersError.message);
    return <p>Could not load leaderboard.</p>;
  }

  const leaderboardData = topUsers.map((user, index) => ({
    rank: index + 1,
    name: user.username || "Anonymous",
    xp: user.xp_total,
    isCurrentUser: user.clerk_id === userId,
    icon: rankIcons[index + 1],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Players</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {leaderboardData.map((player) => (
            <li
              key={player.rank}
              className={`flex items-center justify-between p-2 rounded-md ${
                player.isCurrentUser ? "bg-blue-100 dark:bg-blue-900/50" : ""
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
        </ul>
      </CardContent>
    </Card>
  );
}
