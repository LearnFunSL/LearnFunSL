"use client";

import React, { useState, useEffect } from "react";
import resourcesData from "../lib/data/resources.json";
import ResourceCard from "./ResourceCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Search,
  ArrowLeft,
  Tag,
  Layers,
  BookMarked,
  FileText,
  List,
  Loader2,
} from "lucide-react";
import {
  GroupedSubjects,
  StreamedSubjects,
  gradePastPaperSubjects,
  gradeStreamSubjects,
  gradeTextbookSubjects,
} from "@/lib/subject-data";

// Define the Content interface for resource items
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

// Helper function to convert grade string (e.g., "grade-6") to number
const gradeStringToNumber = (gradeString: string): number | null => {
  if (!gradeString) return null;
  const match = gradeString.match(/grade-(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
};

const grades = Array.from({ length: 13 }, (_, i) => `Grade ${i + 1}`);
const years = [
  "2025",
  "2024",
  "2023",
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
  "2017",
  "2016",
];
const terms = ["Term 1", "Term 2", "Term 3"];
const types = ["Past Paper", "Textbook", "other"];

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedType, setSelectedType] = useState(""); // This is for the main filter

  // States for the multi-view UI flow
  const [currentView, setCurrentView] = useState<
    "filtersAndGrades" | "selectSubjectView" | "selectTypeForSubjectView"
  >("filtersAndGrades");

  // States for 'selectSubjectView'
  const [gradeForSubjectView, setGradeForSubjectView] = useState<string>(""); // Which grade was clicked to enter subject view
  const [subjectsToDisplay, setSubjectsToDisplay] = useState<string[]>([]); // Subjects shown for gradeForSubjectView
  const [selectedSubject, setSelectedSubject] = useState<string>(""); // Subject chosen in 'selectSubjectView' (or from main filters)

  // States for 'selectTypeForSubjectView'
  const [subjectForTypeView, setSubjectForTypeView] = useState<string>(""); // Which subject was clicked to enter type view
  const [selectedTypeForSubject, setSelectedTypeForSubject] =
    useState<string>(""); // Type chosen for subjectForTypeView

  // State for actual resource data
  const [allResources, setAllResources] = useState<Content[]>([]);
  const [filteredResources, setFilteredResources] = useState<Content[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState<boolean>(true);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedGrade("");
    setSelectedYear("");
    setSelectedTerm("");
    setSelectedType("");
    setSubjectsToDisplay([]);
    setSelectedSubject("");
    setCurrentView("filtersAndGrades"); // Reset view on clear
    setGradeForSubjectView("");
    setSubjectForTypeView("");
    setSelectedTypeForSubject("");
    setFilteredResources([]);
    setIsLoadingResources(false); // No loading state after clear
  };

  // Effect to update subjects when grade or type changes
  useEffect(() => {
    setSubjectsToDisplay([]); // Default to empty, then populate based on conditions

    if (currentView === "selectSubjectView" && gradeForSubjectView) {
      const currentGradeKey = gradeForSubjectView;
      // For Grades 10/11 in this view, assume Past Paper subjects are desired as per image context
      if (
        ["grade-10", "grade-11"].includes(currentGradeKey) &&
        gradePastPaperSubjects[currentGradeKey]
      ) {
        const allPastPaperSubjects = [
          ...gradePastPaperSubjects[currentGradeKey].compulsory,
          ...gradePastPaperSubjects[currentGradeKey].optionalGroup1,
          ...gradePastPaperSubjects[currentGradeKey].optionalGroup2,
          ...gradePastPaperSubjects[currentGradeKey].optionalGroup3,
        ];
        setSubjectsToDisplay(allPastPaperSubjects);
      } else if (
        ["grade-12", "grade-13"].includes(currentGradeKey) &&
        gradeStreamSubjects[currentGradeKey]
      ) {
        const allStreamSubjects = Object.values(
          gradeStreamSubjects[currentGradeKey],
        ).flat();
        setSubjectsToDisplay(allStreamSubjects);
      } else if (gradeTextbookSubjects[currentGradeKey]) {
        // For Grades 1-9
        setSubjectsToDisplay(gradeTextbookSubjects[currentGradeKey]);
      } else {
        console.warn(
          `No subjects defined for ${currentGradeKey} in selectSubjectView.`,
        );
      }
      setSelectedSubject("");
    } else if (
      currentView === "filtersAndGrades" &&
      selectedGrade &&
      selectedType
    ) {
      const filterSelectedGradeKey = selectedGrade
        .toLowerCase()
        .replace(" ", "-");
      if (
        selectedType === "textbook" &&
        gradeTextbookSubjects[filterSelectedGradeKey]
      ) {
        setSubjectsToDisplay(gradeTextbookSubjects[filterSelectedGradeKey]);
      } else if (
        selectedType === "past-paper" &&
        ["grade-10", "grade-11"].includes(filterSelectedGradeKey) &&
        gradePastPaperSubjects[filterSelectedGradeKey]
      ) {
        const allPastPaperSubjects = [
          ...gradePastPaperSubjects[filterSelectedGradeKey].compulsory,
          ...gradePastPaperSubjects[filterSelectedGradeKey].optionalGroup1,
          ...gradePastPaperSubjects[filterSelectedGradeKey].optionalGroup2,
          ...gradePastPaperSubjects[filterSelectedGradeKey].optionalGroup3,
        ];
        setSubjectsToDisplay(allPastPaperSubjects);
      } else if (selectedType === "past-paper") {
        // Handle past papers for grades 1-9 if data existed
        console.warn(
          `Past paper subjects not yet defined for ${filterSelectedGradeKey} or this combination.`,
        );
      } else {
        console.warn(
          `No subjects defined for ${filterSelectedGradeKey} with type ${selectedType} via filters.`,
        );
      }
      setSelectedSubject("");
    }
  }, [currentView, gradeForSubjectView, selectedGrade, selectedType]);

  // Effect to scroll to top when view changes, but not for the initial view
  useEffect(() => {
    if (currentView !== "filtersAndGrades") {
      window.scrollTo(0, 0);
    }
  }, [currentView]);

  // Effect to load all resources from JSON on component mount
  useEffect(() => {
    setAllResources(resourcesData as Content[]);
    setIsLoadingResources(false); // Initial load done
  }, []);

  // Effect to filter resources based on current selections
  useEffect(() => {
    setIsLoadingResources(true);
    let processedResources = [...allResources];

    // 1. Search Query Filter (applies universally if searchQuery is present)
    if (searchQuery.trim()) {
      processedResources = processedResources.filter((resource) =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase().trim()),
      );
    }

    let shouldDisplayResources = false;
    let finalFilteredResources: Content[] = [];

    if (
      currentView === "selectTypeForSubjectView" &&
      gradeForSubjectView &&
      subjectForTypeView &&
      selectedTypeForSubject
    ) {
      shouldDisplayResources = true;
      const numericGrade = gradeStringToNumber(gradeForSubjectView);
      // selectedTypeForSubject holds values like "Past Paper", "Textbook", "other"
      const typeForComparison = selectedTypeForSubject
        .toLowerCase()
        .replace(/\s+/g, ""); // Converts "Past Paper" to "pastpaper", "Textbook" to "textbook"

      if (numericGrade) {
        processedResources = processedResources.filter(
          (resource) => resource.grade === numericGrade,
        );
      }
      processedResources = processedResources.filter(
        (resource) =>
          resource.subject.toLowerCase() === subjectForTypeView.toLowerCase(),
      );
      // resource.type is already "pastpaper", "textbook", or "other" as per Content interface
      processedResources = processedResources.filter(
        (resource) => resource.type === typeForComparison,
      );

      // Optionally, apply main year/term filters if they are set
      if (selectedYear && !isNaN(parseInt(selectedYear))) {
        const numericYear = parseInt(selectedYear, 10);
        processedResources = processedResources.filter(
          (resource) => resource.year === numericYear,
        );
      }
      if (selectedTerm) {
        const numericTermMatch = selectedTerm.match(/term-(\d+)/i);
        const numericTerm = numericTermMatch
          ? parseInt(numericTermMatch[1], 10)
          : NaN;
        if (!isNaN(numericTerm)) {
          processedResources = processedResources.filter(
            (resource) => resource.term === numericTerm,
          );
        }
      }
    } else if (currentView === "filtersAndGrades") {
      if (selectedGrade && selectedType && selectedSubject) {
        shouldDisplayResources = true;
        const numericGradeFromFilter = gradeStringToNumber(selectedGrade);
        const normalizedTypeFromFilter = selectedType.replace("-", "");

        if (numericGradeFromFilter) {
          processedResources = processedResources.filter(
            (resource) => resource.grade === numericGradeFromFilter,
          );
        }
        if (normalizedTypeFromFilter) {
          processedResources = processedResources.filter(
            (resource) =>
              resource.type.toLowerCase() === normalizedTypeFromFilter,
          );
        }
        processedResources = processedResources.filter(
          (resource) =>
            resource.subject.toLowerCase() === selectedSubject.toLowerCase(),
        );

        if (selectedYear && !isNaN(parseInt(selectedYear))) {
          const numericYear = parseInt(selectedYear, 10);
          processedResources = processedResources.filter(
            (resource) => resource.year === numericYear,
          );
        }
        if (selectedTerm) {
          const numericTermMatch = selectedTerm.match(/term-(\d+)/i);
          const numericTerm = numericTermMatch
            ? parseInt(numericTermMatch[1], 10)
            : NaN;
          if (!isNaN(numericTerm)) {
            processedResources = processedResources.filter(
              (resource) => resource.term === numericTerm,
            );
          }
        }
      } else {
        shouldDisplayResources = false;
      }
    }

    if (shouldDisplayResources) {
      finalFilteredResources = processedResources;
    } else {
      finalFilteredResources = [];
    }

    setFilteredResources(finalFilteredResources);
    setIsLoadingResources(false);
  }, [
    allResources,
    searchQuery,
    currentView,
    gradeForSubjectView,
    subjectForTypeView,
    selectedTypeForSubject,
    selectedGrade,
    selectedSubject,
    selectedType,
    selectedYear,
    selectedTerm,
  ]);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      {currentView === "filtersAndGrades" && (
        <>
          <h1 className="text-3xl font-bold mb-8 text-center">
            Educational Resources
          </h1>

          <Card className="mb-4 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Search Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="flex gap-2 mb-2">
                <Input
                  type="search"
                  placeholder="Search for subjects, topics, or specific resources..."
                  className="flex-grow"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="button">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                <div>
                  <label
                    htmlFor="grade-filter"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Grade
                  </label>
                  <Select
                    value={selectedGrade}
                    onValueChange={setSelectedGrade}
                  >
                    <SelectTrigger id="grade-filter">
                      <SelectValue placeholder="Select Grade" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      {grades.map((grade) => (
                        <SelectItem
                          key={grade}
                          value={grade.toLowerCase().replace(" ", "-")}
                        >
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label
                    htmlFor="year-filter"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Year
                  </label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger id="year-filter">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label
                    htmlFor="term-filter"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Term
                  </label>
                  <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                    <SelectTrigger id="term-filter">
                      <SelectValue placeholder="Select Term" />
                    </SelectTrigger>
                    <SelectContent>
                      {terms.map((term) => (
                        <SelectItem
                          key={term}
                          value={term.toLowerCase().replace(" ", "-")}
                        >
                          {term}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label
                    htmlFor="type-filter"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Type
                  </label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger id="type-filter">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem
                          key={type}
                          value={type.toLowerCase().replace(" ", "-")}
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Browse by Grade</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {grades.map((grade) => (
                <Card
                  key={grade}
                  className="hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  onClick={() => {
                    const gradeValue = grade.toLowerCase().replace(" ", "-");
                    setGradeForSubjectView(gradeValue);
                    setCurrentView("selectSubjectView");
                  }}
                >
                  <CardContent className="flex flex-col items-center justify-center p-8">
                    <BookOpen className="h-12 w-12 text-primary dark:text-blue-400 mb-3" />
                    <p className="text-lg font-medium text-center text-gray-800 dark:text-gray-200">
                      {grade}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Subject display for 'filtersAndGrades' view (if selectedGrade and selectedType are set) */}
          {subjectsToDisplay.length > 0 && selectedGrade && selectedType && (
            <section className="mt-10">
              <h2 className="text-2xl font-semibold mb-6">
                Select Subject for{" "}
                {selectedGrade
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
                -{" "}
                {selectedType
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
                (Filters View)
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {subjectsToDisplay.map((subject) => (
                  <Card
                    key={subject}
                    className={`hover:shadow-md transition-shadow cursor-pointer rounded-lg ${selectedSubject === subject ? "ring-2 ring-primary shadow-lg" : "border"}`}
                    onClick={() => setSelectedSubject(subject)}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-4 text-center h-full">
                      <Tag className="h-8 w-8 text-primary mb-2" />
                      <p className="text-sm font-medium">{subject}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Resource display for 'filtersAndGrades' view (if all main filters are set) */}
          {selectedGrade && selectedType && selectedSubject && (
            <section className="mt-10">
              <h2 className="text-2xl font-semibold mb-6">
                Filtered Resources:{" "}
                {selectedGrade
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
                - {selectedSubject} -{" "}
                {selectedType
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                {selectedYear && ` - ${selectedYear}`}
                {selectedTerm &&
                  ` - ${selectedTerm.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`}
              </h2>
              {isLoadingResources ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="w-12 h-12 animate-spin text-primary" />
                  <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">
                    Loading resources...
                  </p>
                </div>
              ) : filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-10">
                  No resources found matching your current filter combination.
                </p>
              )}
            </section>
          )}
        </>
      )}
      {currentView === "selectSubjectView" && gradeForSubjectView && (
        <section>
          <Button
            variant="outline"
            onClick={() => {
              setCurrentView("filtersAndGrades");
              setGradeForSubjectView("");
              setSubjectsToDisplay([]);
              setSelectedSubject("");
            }}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Grades
          </Button>
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
            {gradeForSubjectView
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
            -{" "}
            {["grade-10", "grade-11"].includes(gradeForSubjectView ?? "")
              ? "Past Papers"
              : ["grade-12", "grade-13"].includes(gradeForSubjectView ?? "")
                ? "Streams"
                : "Textbooks"}{" "}
            - Select Subject
          </h2>
          {/* Conditional rendering for G12/13 Streamed Subjects */}
          {(gradeForSubjectView === "grade-12" ||
            gradeForSubjectView === "grade-13") &&
          gradeStreamSubjects[gradeForSubjectView] ? (
            <div className="bg-blue-100 dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow-lg">
              {(
                Object.keys(
                  gradeStreamSubjects[gradeForSubjectView ?? ""],
                ) as Array<keyof StreamedSubjects>
              ).map((streamName) => {
                const streamSubjects =
                  gradeStreamSubjects[gradeForSubjectView ?? ""][streamName];
                if (!streamSubjects || streamSubjects.length === 0) return null;
                return (
                  <div key={streamName} className="mb-8">
                    <h3 className="text-xl font-semibold text-primary dark:text-blue-300 mb-4 border-b-2 border-blue-300 dark:border-blue-700 pb-2">
                      {streamName}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {streamSubjects.map((subject) => (
                        <Card
                          key={subject}
                          className={`hover:shadow-md transition-shadow cursor-pointer rounded-lg bg-white dark:bg-slate-700 ${selectedSubject === subject ? "ring-2 ring-primary-dark dark:ring-blue-400 shadow-2xl" : "border border-gray-300 dark:border-slate-600"}`}
                          onClick={() => {
                            setSubjectForTypeView(subject);
                            setCurrentView("selectTypeForSubjectView");
                            setSelectedSubject("");
                          }}
                        >
                          <CardContent className="flex flex-col items-center justify-center p-3 text-center h-full aspect-[3/2]">
                            <Tag className="h-6 w-6 text-blue-700 dark:text-blue-400 mb-2" />
                            <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">
                              {subject}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : /* Conditional rendering for G10/11 Past Papers grouped layout */
          (gradeForSubjectView === "grade-10" ||
              gradeForSubjectView === "grade-11") &&
            gradePastPaperSubjects[gradeForSubjectView] ? (
            <div className="bg-blue-50 dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow">
              {(
                Object.keys(
                  gradePastPaperSubjects[gradeForSubjectView ?? ""],
                ) as Array<keyof GroupedSubjects>
              ).map((groupKey) => {
                const groupSubjects =
                  gradePastPaperSubjects[gradeForSubjectView ?? ""][groupKey];
                if (!groupSubjects || groupSubjects.length === 0) return null;

                const groupTitles: Record<keyof GroupedSubjects, string> = {
                  compulsory: "Compulsory Subjects",
                  optionalGroup1: "Optional - Group 1",
                  optionalGroup2: "Optional - Group 2",
                  optionalGroup3: "Optional - Group 3",
                };

                return (
                  <div key={groupKey} className="mb-8">
                    <h3 className="text-xl font-semibold text-primary dark:text-blue-300 mb-4 border-b-2 border-blue-200 dark:border-blue-700 pb-2">
                      {groupTitles[groupKey]}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {groupSubjects.map((subject) => (
                        <Card
                          key={subject}
                          className={`hover:shadow-md transition-shadow cursor-pointer rounded-lg bg-white dark:bg-slate-700 ${selectedSubject === subject ? "ring-2 ring-primary dark:ring-blue-400 shadow-xl" : "border border-gray-200 dark:border-slate-600"}`}
                          onClick={() => {
                            setSubjectForTypeView(subject);
                            setCurrentView("selectTypeForSubjectView");
                            setSelectedSubject("");
                          }}
                        >
                          <CardContent className="flex flex-col items-center justify-center p-3 text-center h-full aspect-[3/2]">
                            {/* Icon can be dynamic based on subject or group if needed */}
                            <Tag className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                            <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                              {subject}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : subjectsToDisplay.length > 0 ? (
            // Existing layout for Grades 1-9 (Textbooks)
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {subjectsToDisplay.map((subject) => (
                <Card
                  key={subject}
                  className={`hover:shadow-md transition-shadow cursor-pointer rounded-lg bg-white dark:bg-gray-800 ${selectedSubject === subject ? "ring-2 ring-primary shadow-lg" : "border border-gray-200 dark:border-gray-700"}`}
                  onClick={() => {
                    setSubjectForTypeView(subject);
                    setCurrentView("selectTypeForSubjectView");
                    setSelectedSubject("");
                  }}
                >
                  <CardContent className="flex flex-col items-center justify-center p-4 text-center h-full">
                    <Tag className="h-8 w-8 text-primary dark:text-blue-400 mb-2" />
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {subject}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No subjects available for this selection. Ensure appropriate type
              is implicitly handled or allow type selection for this grade.
            </p>
          )}
        </section>
      )}
      {/* View for Selecting Resource Type for a Chosen Subject */}
      {currentView === "selectTypeForSubjectView" &&
        gradeForSubjectView &&
        subjectForTypeView && (
          <section className="bg-gradient-to-br from-slate-50 to-sky-50 dark:from-gray-900 dark:to-gray-800 p-8 rounded-lg shadow-lg">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentView("selectSubjectView"); // Go back to subject selection
                setSubjectForTypeView(""); // Clear the subject chosen for type selection
                setSelectedTypeForSubject(""); // Clear the selected type
                // subjectsToDisplay for selectSubjectView will repopulate via useEffect
              }}
              className="mb-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Subjects
            </Button>
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
              {`${gradeForSubjectView
                .replace(/-/g, " ")
                .replace(/\b\w/g, (l) =>
                  l.toUpperCase(),
                )} - ${subjectForTypeView}`}
            </h2>

            {!selectedTypeForSubject ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {types.map((type) => (
                  <Card
                    key={type}
                    className={`cursor-pointer transition-all duration-150 ease-out ${
                      selectedTypeForSubject === type
                        ? "ring-2 ring-blue-500 shadow-md scale-102"
                        : "hover:shadow-md hover:scale-101"
                    } bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700`}
                    onClick={() => {
                      setSelectedTypeForSubject(type);
                      // Apply the type filter
                    }}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                      {type === "Past Paper" ? (
                        <FileText className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-3" />
                      ) : type === "Textbook" ? (
                        <BookMarked className="h-12 w-12 text-green-600 dark:text-green-400 mb-3" />
                      ) : (
                        <Layers className="h-12 w-12 text-amber-600 dark:text-amber-400 mb-3" />
                      )}
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                        {type}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {type === "Past Paper"
                          ? "Exam papers and model papers"
                          : type === "Textbook"
                            ? "Official curriculum textbooks"
                            : "Additional learning materials"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <section className="mt-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
                    {`${gradeForSubjectView
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) =>
                        l.toUpperCase(),
                      )} - ${subjectForTypeView} - ${selectedTypeForSubject}`}
                  </h3>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTypeForSubject("")}
                    className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Types
                  </Button>
                </div>
                {isLoadingResources ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">
                      Loading resources...
                    </p>
                  </div>
                ) : filteredResources.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-10">
                    No resources found for this selection.
                  </p>
                )}
              </section>
            )}
          </section>
        )}

      {/* Clear Filters Button */}
      {(selectedGrade ||
        selectedYear ||
        selectedTerm ||
        selectedType ||
        selectedSubject) && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="flex items-center"
          >
            <List className="mr-2 h-4 w-4" />
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
