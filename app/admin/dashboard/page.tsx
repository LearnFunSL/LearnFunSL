import React from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import UploadForm from "./UploadForm";
// import { Users, FileText, BarChart2, AlertTriangle } from 'lucide-react'; // Example icons

// Placeholder data for analytics cards
const analyticsData = [
  {
    title: "Total Traffic",
    value: "12,345",
    // icon: BarChart2,
    description: "Past 30 days",
    bgColor: "bg-blue-500",
  },
  {
    title: "Active Users",
    value: "1,280",
    // icon: Users,
    description: "Currently online",
    bgColor: "bg-green-500",
  },
  {
    title: "New Uploads",
    value: "350",
    // icon: FileText,
    description: "This month",
    bgColor: "bg-yellow-500",
  },
  {
    title: "System Alerts",
    value: "3",
    // icon: AlertTriangle,
    description: "Require attention",
    bgColor: "bg-red-500",
  },
];

interface AnalyticsCardProps {
  title: string;
  value: string;
  description: string;
  // icon?: React.ElementType;
  bgColor?: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  description,
  /*icon: Icon,*/ bgColor = "bg-gray-500",
}) => {
  return (
    <div className={`p-6 rounded-lg shadow-lg text-white ${bgColor}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {/* {Icon && <Icon className="h-8 w-8 opacity-75" />} */}
      </div>
      <p className="text-4xl font-bold mb-1">{value}</p>
      <p className="text-sm opacity-90">{description}</p>
    </div>
  );
};

export default async function DashboardOverviewPage() {
  const supabase = createSupabaseServerClient();
  const { data: users, error } = await supabase.from("users").select("email");

  if (error) {
    console.error("Error fetching users:", error);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Dashboard Overview
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.map((data, index) => (
          <AnalyticsCard
            key={index}
            title={data.title}
            value={data.value}
            // icon={data.icon} // Uncomment when icons are set up
            description={data.description}
            bgColor={data.bgColor}
          />
        ))}
      </div>

      {/* Placeholder for more detailed charts or tables */}
      <div className="mt-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Detailed Analytics (Placeholder)
        </h2>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
          <p className="text-gray-400 dark:text-gray-500">
            Chart components (e.g., Recharts, Chart.js) will be integrated here.
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Recent Users
        </h2>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {users && users.length > 0 ? (
            users.map((user: { email: string | null }, index: number) => (
              <li key={index} className="py-3 text-gray-600 dark:text-gray-400">
                {user.email}
              </li>
            ))
          ) : (
            <li className="py-3 text-gray-600 dark:text-gray-400">
              No recent users found.
            </li>
          )}
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Add New Resource
        </h2>
        <UploadForm />
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Recent Uploads
        </h2>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
          <p className="text-gray-400 dark:text-gray-500">
            Recent uploads will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
