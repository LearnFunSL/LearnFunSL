import React from "react";

// Mock current settings - replace with actual data fetching
const currentSettings = {
  platformTitle: "LearnFunSL - Sri Lankan Education Hub",
  platformLogoUrl: "/images/logo.png", // Example path
  theme: "light", // 'light', 'dark', or 'system'
  maintenanceMode: false,
  defaultLanguage: "en",
  allowUserRegistration: true,
  maxUploadSizeMB: 50,
};

// Define types for settings
interface PlatformSettings {
  platformTitle: string;
  platformLogoUrl: string;
  theme: "light" | "dark" | "system";
  maintenanceMode: boolean;
  defaultLanguage: "en" | "si" | "ta";
  allowUserRegistration: boolean;
  maxUploadSizeMB: number;
}

// Helper component for a settings section
interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="mb-10 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-1 text-gray-800 dark:text-white">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {description}
        </p>
      )}
      <div className="space-y-6">{children}</div>
    </div>
  );
};

export default function SettingsPage() {
  // TODO: Implement state management for form inputs (e.g., React Hook Form or useState)
  // TODO: Implement API calls for updating settings
  // TODO: Handle file upload for logo

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Platform Settings
      </h1>

      <SettingsSection
        title="General Settings"
        description="Basic platform configurations."
      >
        <div>
          <label
            htmlFor="platformTitle"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Platform Title
          </label>
          <input
            type="text"
            id="platformTitle"
            defaultValue={currentSettings.platformTitle}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-600 dark:border-gray-500"
          />
        </div>
        <div>
          <label
            htmlFor="platformLogo"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Platform Logo
          </label>
          <input
            type="file"
            id="platformLogo"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-700 dark:file:text-blue-50"
          />
          {currentSettings.platformLogoUrl && (
            <img
              src={currentSettings.platformLogoUrl}
              alt="Current Logo"
              className="mt-2 h-16 w-auto"
            />
          )}
        </div>
        <div>
          <label
            htmlFor="defaultLanguage"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Default Language
          </label>
          <select
            id="defaultLanguage"
            defaultValue={currentSettings.defaultLanguage}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-600 dark:border-gray-500"
          >
            <option value="en">English</option>
            <option value="si">Sinhala</option>
            <option value="ta">Tamil</option>
          </select>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Appearance"
        description="Customize the look and feel of the platform."
      >
        <div>
          <label
            htmlFor="theme"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Theme
          </label>
          <select
            id="theme"
            defaultValue={currentSettings.theme}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-600 dark:border-gray-500"
          >
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
            <option value="system">System Preference</option>
          </select>
        </div>
      </SettingsSection>

      <SettingsSection
        title="System & Security"
        description="Manage system behavior and security settings."
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">
              Maintenance Mode
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Temporarily disable access to the main website for users.
            </p>
          </div>
          <label
            htmlFor="maintenanceMode"
            className="relative inline-flex items-center cursor-pointer"
          >
            <input
              type="checkbox"
              id="maintenanceMode"
              defaultChecked={currentSettings.maintenanceMode}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">
              Allow User Registration
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enable or disable new user sign-ups.
            </p>
          </div>
          <label
            htmlFor="allowUserRegistration"
            className="relative inline-flex items-center cursor-pointer"
          >
            <input
              type="checkbox"
              id="allowUserRegistration"
              defaultChecked={currentSettings.allowUserRegistration}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div>
          <label
            htmlFor="maxUploadSizeMB"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Max Upload Size (MB)
          </label>
          <input
            type="number"
            id="maxUploadSizeMB"
            defaultValue={currentSettings.maxUploadSizeMB}
            min="1"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-600 dark:border-gray-500"
          />
        </div>
      </SettingsSection>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Save All Settings
        </button>
      </div>
    </div>
  );
}
