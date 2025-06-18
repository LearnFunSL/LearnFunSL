"use client";

import React from "react";
import contentData from "../../lib/data/resources.json";

// Define types for content based on tech-stack.md
interface Content {
  id: string;
  title: string;
  type: "pastpaper" | "textbook" | "other";
  subject: string;
  grade: number;
  year?: number;
  term: number;
  medium: "english" | "sinhala" | "tamil";
  file_url: string;
  metadata: Record<string, any>;
  created_at: string; // Assuming string for simplicity, can be Date
}

// Form specific types (can be different from the data model)
// These were the original types for the form select options
type FormContentType =
  | "Textbook"
  | "Video"
  | "Past Paper"
  | "Syllabus"
  | "Other";
type FormContentMedium = "English" | "Sinhala" | "Tamil";

const mockContent: Content[] = contentData as Content[]; // Use imported data and cast to Content[]

export default function ContentManagementPage() {
  // TODO: Implement state and handlers for form inputs
  // TODO: Implement file upload logic
  // TODO: Implement API calls for creating, updating, deleting content
  // TODO: Implement filtering and pagination for content list

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Content Management
        </h1>
        {/* TODO: Could be a modal trigger */}
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Upload New Content
        </button>
      </div>

      {/* Upload New Content Form (Simplified) */}
      <div className="mb-10 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Upload New Resource
        </h2>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="contentTitle"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Title
            </label>
            <input
              type="text"
              id="contentTitle"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-600 dark:border-gray-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="contentType"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Type
              </label>
              <select
                id="contentType"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-600 dark:border-gray-500"
              >
                {(
                  [
                    "Textbook",
                    "Video",
                    "Past Paper",
                    "Syllabus",
                    "Other",
                  ] as FormContentType[]
                ).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="contentSubject"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Subject
              </label>
              <input
                type="text"
                id="contentSubject"
                placeholder="e.g., Mathematics"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-600 dark:border-gray-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="contentGrade"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Grade
              </label>
              <input
                type="number"
                id="contentGrade"
                min="1"
                max="13"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-600 dark:border-gray-500"
              />
            </div>
            <div>
              <label
                htmlFor="contentMedium"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Medium
              </label>
              <select
                id="contentMedium"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-600 dark:border-gray-500"
              >
                {(["English", "Sinhala", "Tamil"] as FormContentMedium[]).map(
                  (medium) => (
                    <option key={medium} value={medium}>
                      {medium}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="contentFile"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              File / URL
            </label>
            <input
              type="file"
              id="contentFile"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-700 dark:file:text-blue-50"
            />
            <input
              type="text"
              id="contentUrl"
              placeholder="Or enter YouTube/Video URL"
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-600 dark:border-gray-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add Content
          </button>
        </form>
      </div>

      {/* Existing Content Table */}
      <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
        Existing Content
      </h2>
      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {[
                "ID",
                "Title",
                "Type",
                "Subject",
                "Grade",
                "Medium",
                "Created At",
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
            {mockContent.map((item: Content) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {item.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {item.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {item.metadata.original_type || item.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {item.subject}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {item.grade}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {item.medium}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(item.created_at).toLocaleDateString("en-GB")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                    Edit
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
