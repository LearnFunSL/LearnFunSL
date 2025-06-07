"use client";

import React, { useState, useEffect, useMemo } from "react";
import resourcesData from "../../lib/data/resources.json"; // Adjusted path to app/data
import ResourceCard from "./ResourceCard"; // Import the new ResourceCard component
import { ChevronRight, Home } from "lucide-react";

// Interface for individual resource items
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

const allInitialResources: Content[] = resourcesData as Content[];

type NavigationStep = "grade" | "subject" | "type" | "resources";

interface BreadcrumbItem {
  label: string;
  step: NavigationStep;
  value?: number | string;
}

export default function EducationalResourcesPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allResources, setAllResources] = useState<Content[]>([]);

  const [currentStep, setCurrentStep] = useState<NavigationStep>("grade");
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null); // 'all' or specific type

  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { label: "All Grades", step: "grade" },
  ]);

  useEffect(() => {
    // Simulate initial data load
    setIsLoading(true);
    setAllResources(allInitialResources);

    setIsLoading(false);
  }, []);

  // Memoized calculations for unique grades, subjects, types, and filtered resources
  const uniqueGrades = useMemo(() => {
    const grades = new Set(allResources.map((res) => res.grade));
    return Array.from(grades).sort((a, b) => a - b);
  }, [allResources]);

  const availableSubjects = useMemo(() => {
    if (!selectedGrade) return [];
    const subjects = new Set(
      allResources
        .filter((res) => res.grade === selectedGrade)
        .map((res) => res.subject),
    );
    return Array.from(subjects).sort();
  }, [allResources, selectedGrade]);

  const availableTypes = useMemo(() => {
    if (!selectedGrade || !selectedSubject) return [];
    const types = new Set(
      allResources
        .filter(
          (res) =>
            res.grade === selectedGrade && res.subject === selectedSubject,
        )
        .map((res) => res.type),
    );
    return ["all", ...Array.from(types).sort()]; // Add 'all' option
  }, [allResources, selectedGrade, selectedSubject]);

  const filteredResources = useMemo(() => {
    if (!selectedGrade || !selectedSubject || !selectedType) return [];
    return allResources.filter(
      (res) =>
        res.grade === selectedGrade &&
        res.subject === selectedSubject &&
        (selectedType === "all" || res.type === selectedType),
    );
  }, [allResources, selectedGrade, selectedSubject, selectedType]);

  // Event Handlers
  const handleGradeSelect = (grade: number) => {
    setSelectedGrade(grade);
    setCurrentStep("subject");
    setSelectedSubject(null); // Reset subsequent selections
    setSelectedType(null);
    setBreadcrumbs([
      { label: "All Grades", step: "grade" },
      { label: `Grade ${grade}`, step: "subject", value: grade },
    ]);
  };

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setCurrentStep("type");
    setSelectedType(null); // Reset type selection
    setBreadcrumbs((prev) => [
      ...prev,
      { label: subject, step: "type", value: subject },
    ]);
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setCurrentStep("resources");

    setBreadcrumbs((prev) => [
      ...prev,
      {
        label: type === "all" ? "All Types" : type,
        step: "resources",
        value: type,
      },
    ]);
  };

  const handleBreadcrumbClick = (index: number) => {
    const clickedCrumb = breadcrumbs[index];
    setCurrentStep(clickedCrumb.step);
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));

    // Reset selections based on the step clicked
    if (clickedCrumb.step === "grade") {
      setSelectedGrade(null);
      setSelectedSubject(null);
      setSelectedType(null);
    } else if (clickedCrumb.step === "subject") {
      // Grade is already set from breadcrumb.value if it exists
      // Or it's already in selectedGrade state
      setSelectedSubject(null);
      setSelectedType(null);
    } else if (clickedCrumb.step === "type") {
      // Grade and Subject are set
      setSelectedType(null);
    }
  };

  // Render functions for each step
  const renderGradeSelection = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
        Select a Grade
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {uniqueGrades.map((grade) => (
          <button
            key={grade}
            onClick={() => handleGradeSelect(grade)}
            className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors text-center font-medium text-blue-600 dark:text-blue-300"
          >
            Grade {grade}
          </button>
        ))}
      </div>
    </div>
  );

  const renderSubjectSelection = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
        Select a Subject for Grade {selectedGrade}
      </h2>
      {availableSubjects.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {availableSubjects.map((subject) => (
            <button
              key={subject}
              onClick={() => handleSubjectSelect(subject)}
              className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow hover:bg-green-50 dark:hover:bg-gray-600 transition-colors text-center font-medium text-green-600 dark:text-green-300"
            >
              {subject}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          No subjects found for this grade.
        </p>
      )}
    </div>
  );

  const renderTypeSelection = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
        Select a Type for {selectedSubject} (Grade {selectedGrade})
      </h2>
      {availableTypes.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {availableTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleTypeSelect(type)}
              className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow hover:bg-indigo-50 dark:hover:bg-gray-600 transition-colors text-center font-medium text-indigo-600 dark:text-indigo-300 capitalize"
            >
              {type === "all" ? "All Types" : type}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          No resource types found for this subject and grade.
        </p>
      )}
    </div>
  );

  const renderResourceDisplay = () => {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          Resources for Grade {selectedGrade} - {selectedSubject} -{" "}
          {selectedType === "all" ? "All Types" : selectedType?.toString()}
        </h2>
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No resources found for your selection.
          </p>
        )}
      </div>
    );
  };

  if (isLoading) {
    return <div className="p-8 text-center text-lg">Loading resources...</div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Educational Resources Library
        </h1>
      </header>

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            )}
            <button
              onClick={() => handleBreadcrumbClick(index)}
              disabled={
                index === breadcrumbs.length - 1 && currentStep === crumb.step
              } // Disable if it's the last active crumb
              className={`hover:text-blue-600 dark:hover:text-blue-400 ${
                index === breadcrumbs.length - 1 && currentStep === crumb.step
                  ? "text-blue-500 dark:text-blue-300 font-semibold"
                  : ""
              } ${index === 0 ? "flex items-center gap-1" : ""}`}
            >
              {index === 0 && <Home className="w-4 h-4" />}
              {crumb.label}
            </button>
          </React.Fragment>
        ))}
      </nav>

      {/* Content Area based on current step */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        {currentStep === "grade" && renderGradeSelection()}
        {currentStep === "subject" && selectedGrade && renderSubjectSelection()}
        {currentStep === "type" &&
          selectedGrade &&
          selectedSubject &&
          renderTypeSelection()}
        {currentStep === "resources" &&
          selectedGrade &&
          selectedSubject &&
          selectedType &&
          renderResourceDisplay()}
      </div>
    </div>
  );
}
