"use client";

import React from "react";
import { Resource } from "@/app/lib/types";
import { getFileIcon, formatFileSize } from "@/app/lib/resource-utils";
import { Download, Eye } from "lucide-react";

interface ResourceCardProps {
  resource: Resource;
  onView: (fileUrl: string) => void;
  onDownload: (fileUrl: string, fileName: string) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onView,
  onDownload,
}) => {
  const fileIcon = getFileIcon(resource.type);
  const fileSize = formatFileSize(resource.metadata.size);

  const handleView = () => {
    // In a real app, this might open a modal or navigate to a viewer page
    // For PDFs, could use a library like react-pdf or a simple iframe
    // For now, let's assume onView handles the logic (e.g., window.open)
    onView(resource.file_url);
  };

  const handleDownload = () => {
    // Basic download. For more control (e.g. cross-origin), a server-side endpoint might be needed.
    onDownload(resource.file_url, resource.title);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-all hover:shadow-xl">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span className="text-blue-500 dark:text-blue-400">{fileIcon}</span>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 leading-tight">
              {resource.title}
            </h3>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <p>
            <span className="font-medium">Subject:</span> {resource.subject}
          </p>
          <p>
            <span className="font-medium">Grade:</span> {resource.grade}
          </p>
          {resource.year && (
            <p>
              <span className="font-medium">Year:</span> {resource.year}
            </p>
          )}
          {resource.term && (
            <p>
              <span className="font-medium">Term:</span> {resource.term}
            </p>
          )}
          <p>
            <span className="font-medium">Medium:</span>{" "}
            <span className="capitalize">{resource.medium}</span>
          </p>
          <p>
            <span className="font-medium">Type:</span>{" "}
            <span className="capitalize">{resource.type}</span>
          </p>
          {resource.metadata.size && (
            <p>
              <span className="font-medium">Size:</span> {fileSize}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleView}
            className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 rounded-md hover:bg-green-200 dark:hover:bg-green-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};
