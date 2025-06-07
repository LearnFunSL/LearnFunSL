import React from "react";
import { BookOpen, Download, FileText, Film, Type } from "lucide-react";

// Using the same Content interface from page.tsx
// If this interface is used in multiple places, consider moving it to a shared types file e.g., app/lib/types.ts
interface Content {
  id: string;
  title: string;
  type: "pastpaper" | "textbook" | "other";
  subject: string;
  grade: number;
  year?: number | null;
  term?: number | null;
  medium: "english" | "sinhala" | "tamil";
  file_url: string;
  metadata: {
    original_type?: string;
    original_status?: string;
    size?: string;
    uploader?: string;
    lastModified?: string;
    duration?: string;
    original_actual_type?: string;
  };
  created_at: string;
}

interface ResourceCardProps {
  resource: Content;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const getFileIcon = (type: Content["type"]) => {
    switch (type) {
      case "textbook":
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      case "pastpaper":
        return <FileText className="w-5 h-5 text-green-500" />;
      case "other": // Assuming 'other' might include videos or generic documents
        if (resource.metadata.original_type?.toLowerCase().includes("video")) {
          return <Film className="w-5 h-5 text-purple-500" />;
        }
        return <Type className="w-5 h-5 text-gray-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-md font-semibold text-blue-600 dark:text-blue-400 pr-2">
            {resource.title}
          </h4>
          <div className="flex-shrink-0">{getFileIcon(resource.type)}</div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Grade {resource.grade} • {resource.subject}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Type: {resource.metadata.original_type || resource.type} • Medium:{" "}
          {resource.medium}
        </p>
        {resource.type === "pastpaper" && resource.year && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Year: {resource.year}
          </p>
        )}
        {resource.metadata.size && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Size: {resource.metadata.size}
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Added: {new Date(resource.created_at).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center space-x-2 mt-4">
        <a
          href={resource.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
        >
          View
        </a>
        <a
          href={resource.file_url}
          download
          className="flex-1 px-3 py-2 text-sm font-medium text-center text-white bg-green-600 rounded-md hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors"
        >
          Download
        </a>
      </div>
    </div>
  );
};

export default ResourceCard;
