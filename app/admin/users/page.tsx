"use client";

import React from "react";

// Mock user data - replace with actual data fetching later
const mockUsers: User[] = [
  {
    id: "usr_001",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Student",
    status: "Active",
    joinedDate: "2023-01-15",
  },
  {
    id: "usr_002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Teacher",
    status: "Active",
    joinedDate: "2022-11-20",
  },
  {
    id: "usr_003",
    name: "Admin User",
    email: "admin@learnfunsl.com",
    role: "Superadmin",
    status: "Active",
    joinedDate: "2022-10-01",
  },
  {
    id: "usr_004",
    name: "Pending User",
    email: "pending@example.com",
    role: "Student",
    status: "Suspended",
    joinedDate: "2023-05-10",
  },
];

// Define types for clarity
type UserRole = "Student" | "Teacher" | "Editor" | "Superadmin";
type UserStatus = "Active" | "Suspended" | "Pending";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedDate: string;
}

const statusColors: Record<UserStatus, string> = {
  Active: "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100",
  Suspended: "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100",
  Pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100",
};

export default function UserManagementPage() {
  // TODO: Implement filtering logic
  // TODO: Implement pagination
  // TODO: Implement actual API calls for actions

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          User Management
        </h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Add New User
        </button>
      </div>

      {/* Filters Section */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="roleFilter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              Filter by Role
            </label>
            <select
              id="roleFilter"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            >
              <option value="">All Roles</option>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Editor">Editor</option>
              <option value="Superadmin">Superadmin</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="statusFilter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              Filter by Status
            </label>
            <select
              id="statusFilter"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="searchUser"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              Search User
            </label>
            <input
              type="text"
              id="searchUser"
              placeholder="Search by name or email..."
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {[
                "User ID",
                "Name",
                "Email",
                "Role",
                "Status",
                "Joined Date",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {mockUsers.map((user: User) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[user.status] || "bg-gray-100 text-gray-800"}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {user.joinedDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                    Edit
                  </button>
                  <button
                    className={`text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300`}
                  >
                    {user.status === "Active" ? "Suspend" : "Unsuspend"}
                  </button>
                  <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* TODO: Add pagination controls */}
    </div>
  );
}
