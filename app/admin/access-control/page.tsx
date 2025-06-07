import React from "react";

// Mock data for roles and permissions
const mockRoles = [
  {
    id: "role_superadmin",
    name: "Superadmin",
    description: "Full access to all system features and settings.",
    permissions: [
      "manage_users",
      "manage_content",
      "manage_settings",
      "manage_roles",
      "view_analytics",
    ],
  },
  {
    id: "role_editor",
    name: "Editor",
    description: "Can manage content, upload resources, and view analytics.",
    permissions: ["manage_content", "view_analytics"],
  },
  {
    id: "role_moderator",
    name: "Content Moderator",
    description: "Can review and approve/reject content submissions.",
    permissions: ["manage_content_moderation"],
  },
];

const allPermissions = [
  { id: "manage_users", label: "Manage Users (View, Edit, Suspend, Delete)" },
  { id: "manage_content", label: "Manage Content (Upload, Edit, Delete)" },
  { id: "manage_content_moderation", label: "Moderate Content Submissions" },
  { id: "manage_settings", label: "Manage Platform Settings" },
  { id: "manage_roles", label: "Manage Roles and Permissions" },
  { id: "view_analytics", label: "View Dashboard Analytics" },
  { id: "manage_notifications", label: "Send System Notifications" },
];

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface Permission {
  id: string;
  label: string;
}

export default function AccessControlPage() {
  // TODO: Implement state for selected role, editing permissions
  // TODO: Implement API calls for managing roles and permissions

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Access Control Management
        </h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Create New Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Roles List */}
        <div className="md:col-span-1 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            Available Roles
          </h2>
          <ul className="space-y-3">
            {mockRoles.map((role) => (
              <li key={role.id}>
                <button
                  className="w-full text-left p-3 rounded-md hover:bg-blue-100 dark:hover:bg-blue-600 focus:bg-blue-100 dark:focus:bg-blue-600 focus:outline-none transition-colors"
                  // onClick={() => setSelectedRole(role)} // TODO: Implement selection
                >
                  <h3 className="font-medium text-gray-800 dark:text-white">
                    {role.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {role.description}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Permissions Editor for Selected Role */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            Edit Permissions for [Selected Role Name]
          </h2>
          {/* TODO: Display this section only when a role is selected */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Select the permissions for the chosen role. Changes will apply to
            all users assigned to this role.
          </p>
          <form className="space-y-4">
            {allPermissions.map((permission: Permission) => (
              <div key={permission.id} className="flex items-center">
                <input
                  id={`perm_${permission.id}`}
                  name={`perm_${permission.id}`}
                  type="checkbox"
                  // checked={selectedRole?.permissions.includes(permission.id)} // TODO
                  // onChange={(e) => handlePermissionChange(permission.id, e.target.checked)} // TODO
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                />
                <label
                  htmlFor={`perm_${permission.id}`}
                  className="ml-3 block text-sm text-gray-700 dark:text-gray-200"
                >
                  {permission.label}
                </label>
              </div>
            ))}
            <div className="pt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Save Permissions
              </button>
            </div>
          </form>
          {/* Placeholder if no role is selected */}
          {/* {!selectedRole && <p className="text-gray-500 dark:text-gray-400">Select a role from the list to view or edit its permissions.</p>} */}
        </div>
      </div>
    </div>
  );
}
