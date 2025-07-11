import React from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import UploadForm from "./UploadForm";
import { Users, FileText, BarChart2, AlertTriangle } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon?: React.ElementType;
  bgColor?: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  bgColor = "bg-gray-500",
}) => {
  return (
    <div className={`p-6 rounded-lg shadow-lg text-white ${bgColor}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {Icon && <Icon className="h-8 w-8 opacity-75" />}
      </div>
      <p className="text-4xl font-bold mb-1">{value}</p>
      <p className="text-sm opacity-90">{description}</p>
    </div>
  );
};

export default async function DashboardOverviewPage() {
  const supabase = createSupabaseServerClient();

  // Fetch analytics data in parallel
  const [
    { count: totalUsers, error: usersError },
    { count: newUploads, error: uploadsError },
    { data: recentUploads, error: recentUploadsError },
    { data: recentUsers, error: recentUsersError },
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase
      .from("content")
      .select("*", { count: "exact", head: true })
      .gte(
        "created_at",
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      ),
    supabase
      .from("content")
      .select("title, type")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("users")
      .select("email, username")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  if (usersError)
    console.error("Error fetching total users:", usersError.message);
  if (uploadsError)
    console.error("Error fetching new uploads:", uploadsError.message);
  if (recentUploadsError)
    console.error("Error fetching recent uploads:", recentUploadsError.message);
  if (recentUsersError)
    console.error("Error fetching recent users:", recentUsersError.message);

  const analyticsData = [
    {
      title: "Total Users",
      value: totalUsers ?? 0,
      icon: Users,
      description: "All registered users",
      bgColor: "bg-green-500",
    },
    {
      title: "New Uploads",
      value: newUploads ?? 0,
      icon: FileText,
      description: "Past 30 days",
      bgColor: "bg-yellow-500",
    },
    {
      title: "Total Traffic",
      value: "N/A",
      icon: BarChart2,
      description: "Analytics not set up",
      bgColor: "bg-blue-500",
    },
    {
      title: "System Alerts",
      value: "N/A",
      icon: AlertTriangle,
      description: "Monitoring not set up",
      bgColor: "bg-red-500",
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Dashboard Overview
      </h1>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.map((data) => (
          <AnalyticsCard
            key={data.title}
            title={data.title}
            value={data.value}
            icon={data.icon}
            description={data.description}
            bgColor={data.bgColor}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            Recent Users
          </h2>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentUsers && recentUsers.length > 0 ? (
              recentUsers.map((user, index) => (
                <li
                  key={index}
                  className="py-3 text-gray-600 dark:text-gray-400"
                >
                  {user.username || user.email}
                </li>
              ))
            ) : (
              <li className="py-3 text-gray-600 dark:text-gray-400">
                No recent users found.
              </li>
            )}
          </ul>
        </div>

        {/* Recent Uploads */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            Recent Uploads
          </h2>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentUploads && recentUploads.length > 0 ? (
              recentUploads.map((upload, index) => (
                <li
                  key={index}
                  className="py-3 text-gray-600 dark:text-gray-400"
                >
                  <span className="font-medium">{upload.title}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({upload.type})
                  </span>
                </li>
              ))
            ) : (
              <li className="py-3 text-gray-600 dark:text-gray-400">
                No recent uploads found.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Add New Resource Form */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Add New Resource
        </h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <UploadForm />
        </div>
      </div>
    </div>
  );
}
