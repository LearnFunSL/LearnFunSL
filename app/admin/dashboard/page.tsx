import React from "react";
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

export default function DashboardOverviewPage() {
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
          Recent Activity (Placeholder)
        </h2>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          <li className="py-3 text-gray-600 dark:text-gray-400">
            User &apos;john.doe&apos; logged in.
          </li>
          <li className="py-3 text-gray-600 dark:text-gray-400">
            New past paper &apos;Math Grade 10 2023&apos; uploaded.
          </li>
          <li className="py-3 text-gray-600 dark:text-gray-400">
            Settings updated: Maintenance mode enabled.
          </li>
        </ul>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Account Information
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Here&apos;s a quick overview of what&apos;s happening on your
          platform.
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          You&apos;re currently on the Pro Plan, which renews on July 1st, 2024.
        </div>
      </div>
    </div>
  );
}
