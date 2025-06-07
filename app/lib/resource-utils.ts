// app/lib/resource-utils.ts
import { Resource } from "./types";
import { FileText, Video, Book, HelpCircle } from "lucide-react";
import React from "react";

export const getFileIcon = (resourceType: string): React.ReactElement => {
  switch (resourceType.toLowerCase()) {
    case "textbook":
    case "notes":
    case "pdf":
      return React.createElement(Book, { className: "w-5 h-5" });
    case "pastpaper":
    case "modelpaper":
    case "document":
      return React.createElement(FileText, { className: "w-5 h-5" });
    case "video":
    case "lesson":
      return React.createElement(Video, { className: "w-5 h-5" });
    default:
      return React.createElement(HelpCircle, { className: "w-5 h-5" });
  }
};

export const formatFileSize = (bytes?: string | number): string => {
  if (bytes === undefined || bytes === null) return "N/A";
  if (typeof bytes === "string") {
    // Assuming format like "2.5 MB"
    const parts = bytes.split(" ");
    if (
      parts.length === 2 &&
      !isNaN(parseFloat(parts[0])) &&
      ["KB", "MB", "GB", "TB"].includes(parts[1].toUpperCase())
    ) {
      return bytes;
    }
    // If it's just a number string, parse it
    const numBytes = parseInt(bytes, 10);
    if (isNaN(numBytes)) return "N/A";
    bytes = numBytes;
  } else if (typeof bytes !== "number") {
    return "N/A";
  }

  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getUniqueGrades = (resources: Resource[]): number[] => {
  const grades = new Set(resources.map((r) => r.grade));
  return Array.from(grades).sort((a, b) => a - b);
};

export const getUniqueSubjects = (
  resources: Resource[],
  selectedGrade?: number | null,
): string[] => {
  const filteredResources = selectedGrade
    ? resources.filter((r) => r.grade === selectedGrade)
    : resources;
  const subjects = new Set(filteredResources.map((r) => r.subject));
  return Array.from(subjects).sort();
};

export const getUniqueTypes = (
  resources: Resource[],
  selectedGrade?: number | null,
  selectedSubject?: string | null,
): string[] => {
  let filteredResources = resources;
  if (selectedGrade) {
    filteredResources = filteredResources.filter(
      (r) => r.grade === selectedGrade,
    );
  }
  if (selectedSubject) {
    filteredResources = filteredResources.filter(
      (r) => r.subject === selectedSubject,
    );
  }
  const types = new Set(filteredResources.map((r) => r.type));
  return Array.from(types).sort();
};
