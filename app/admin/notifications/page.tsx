"use client";

import React from "react";

// Mock notification data
const mockNotifications: NotificationItem[] = [
  {
    id: "notif_001",
    title: "System Update Required",
    message:
      "A critical system update (v2.5.1) is pending. Please schedule a maintenance window.",
    type: "System Alert",
    priority: "High",
    timestamp: "2023-05-15 10:30 AM",
    read: false,
  },
  {
    id: "notif_002",
    title: "New Content Moderation Queue",
    message:
      "15 new video uploads are awaiting moderation in the content queue.",
    type: "Admin Message",
    priority: "Medium",
    timestamp: "2023-05-14 02:00 PM",
    read: true,
  },
  {
    id: "notif_003",
    title: "High Server Load Detected",
    message:
      "Server CPU usage reached 85% at 09:45 AM. Monitoring the situation.",
    type: "System Alert",
    priority: "High",
    timestamp: "2023-05-15 09:50 AM",
    read: false,
  },
  {
    id: "notif_004",
    title: "Welcome New Admin!",
    message: "User editor@learnfunsl.com has been promoted to Editor role.",
    type: "Admin Message",
    priority: "Low",
    timestamp: "2023-05-12 05:00 PM",
    read: true,
  },
];

// Define types for notifications
type NotificationType = "System Alert" | "Admin Message" | "User Activity";
type NotificationPriority = "High" | "Medium" | "Low";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  timestamp: string;
  read: boolean;
}

const priorityColors: Record<NotificationPriority, string> = {
  High: "border-red-500 dark:border-red-400",
  Medium: "border-yellow-500 dark:border-yellow-400",
  Low: "border-blue-500 dark:border-blue-400",
};

const typeColors: Record<NotificationType, string> = {
  "System Alert": "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200",
  "Admin Message":
    "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  "User Activity":
    "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-200",
};

export default function NotificationsPage() {
  // TODO: Implement state and handlers for form inputs
  // TODO: Implement API calls for sending/marking notifications
  // TODO: Implement filtering (e.g., read/unread, priority)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Notifications
        </h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Create New Notification
        </button>
      </div>

      {/* Create Notification Form (Simplified) */}
      <div className="mb-10 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Send New Notification
        </h2>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="notifTitle"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Title
            </label>
            <input
              type="text"
              id="notifTitle"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-600 dark:border-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="notifMessage"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Message
            </label>
            <textarea
              id="notifMessage"
              rows={3}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-600 dark:border-gray-500"
            ></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="notifType"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Type
              </label>
              <select
                id="notifType"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-600 dark:border-gray-500"
              >
                <option>Admin Message</option>
                <option>System Alert</option>
                <option>User Activity</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="notifPriority"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Priority
              </label>
              <select
                id="notifPriority"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-600 dark:border-gray-500"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>
          {/* TODO: Add target audience selection (e.g., all users, specific roles) */}
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Send Notification
          </button>
        </form>
      </div>

      {/* Notifications List */}
      <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
        Recent Notifications
      </h2>
      <div className="space-y-4">
        {mockNotifications.map((notif: NotificationItem) => (
          <div
            key={notif.id}
            className={`p-4 rounded-lg shadow-md border-l-4 ${priorityColors[notif.priority]} ${notif.read ? "bg-white dark:bg-gray-800 opacity-70" : "bg-white dark:bg-gray-800"}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3
                  className={`text-lg font-semibold ${typeColors[notif.type]}`}
                >
                  {notif.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {notif.message}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  {notif.timestamp} - {notif.type}
                </p>
              </div>
              {!notif.read && (
                <button className="text-xs text-blue-500 hover:underline dark:text-blue-400">
                  Mark as Read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* TODO: Add pagination or 'load more' for notifications */}
    </div>
  );
}
