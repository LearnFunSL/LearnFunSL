import React from "react";
import {
  BookOpen,
  Download,
  FileText,
  Film,
  Type,
  Layers,
  BookMarked,
  List,
} from "lucide-react";
import { Content } from "@/types/resources"; // Assuming types are in @/types/resources

interface ResourceCardProps {
  title: string;
  type: "grade" | "subject" | "type" | Content["type"];
  onClick?: () => void;
  icon?: React.ReactNode;
  subject?: string;
  grade?: number;
  year?: number | null;
  term?: number | null;
  medium?: "english" | "sinhala" | "tamil";
  file_url?: string;
  isSelected?: boolean;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  type,
  onClick,
  icon,
  subject,
  grade,
  year,
  term,
  medium,
  file_url,
  isSelected,
}) => {
  const renderContent = () => {
    if (type === "grade" || type === "subject" || type === "type") {
      return (
        <div
          className={`p-4 flex flex-col items-center justify-center text-center cursor-pointer h-full rounded-lg border-2
            ${
              isSelected
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/50"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            }
            hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200`}
          onClick={onClick}
        >
          {icon}
          <p className="mt-2 font-semibold text-gray-700 dark:text-gray-200">
            {title}
          </p>
        </div>
      );
    }

    // Existing resource card for content display
    return (
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-md font-semibold text-blue-600 dark:text-blue-400 pr-2">
              {title}
            </h4>
            <div className="flex-shrink-0">
              {type === "textbook" ? (
                <BookOpen className="w-5 h-5 text-blue-500" />
              ) : type === "pastpaper" ? (
                <FileText className="w-5 h-5 text-green-500" />
              ) : (
                <Type className="w-5 h-5 text-gray-500" />
              )}
            </div>
          </div>
          {grade && subject && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Grade {grade} • {subject}
            </p>
          )}
          {medium && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Medium: {medium}
            </p>
          )}
          {type === "pastpaper" && year && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Year: {year}
            </p>
          )}
        </div>
        {file_url && (
          <div className="flex items-center space-x-2 mt-4">
            <a
              href={file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            >
              View
            </a>
            <a
              href={file_url}
              download
              className="flex-1 px-3 py-2 text-sm font-medium text-center text-white bg-green-600 rounded-md hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors"
            >
              Download
            </a>
          </div>
        )}
      </div>
    );
  };

  return renderContent();
};

export default ResourceCard;
