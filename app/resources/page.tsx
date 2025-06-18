"use client";

import React, { useState, useEffect } from "react";
import resourcesData from "@/lib/data/resources.json";
import ResourceCard from "./ResourceCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Content } from "@/types/resources";

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
const types = ["Past Paper", "Textbook", "Other"];

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const [currentView, setCurrentView] = useState<
    "filtersAndGrades" | "selectSubjectView" | "selectTypeForSubjectView"
  >("filtersAndGrades");

  const [gradeForSubjectView, setGradeForSubjectView] = useState<string>("");
  const [subjectsToDisplay, setSubjectsToDisplay] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  const [subjectForTypeView, setSubjectForTypeView] = useState<string>("");
  const [selectedTypeForSubject, setSelectedTypeForSubject] =
    useState<string>("");

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
    setCurrentView("filtersAndGrades");
    setGradeForSubjectView("");
    setSubjectForTypeView("");
    setSelectedTypeForSubject("");
    setFilteredResources([]);
    setIsLoadingResources(false);
  };

  useEffect(() => {
    setSubjectsToDisplay([]);
    if (currentView === "selectSubjectView" && gradeForSubjectView) {
      const currentGradeKey = gradeForSubjectView;
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
        setSubjectsToDisplay(allStreamSubjects as string[]);
      } else if (gradeTextbookSubjects[currentGradeKey]) {
        setSubjectsToDisplay(gradeTextbookSubjects[currentGradeKey]);
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
      }
      setSelectedSubject("");
    }
  }, [currentView, gradeForSubjectView, selectedGrade, selectedType]);

  useEffect(() => {
    if (currentView !== "filtersAndGrades") {
      window.scrollTo(0, 0);
    }
  }, [currentView]);

  useEffect(() => {
    setAllResources(resourcesData as Content[]);
    setIsLoadingResources(false);
  }, []);

  useEffect(() => {
    setIsLoadingResources(true);
    let processedResources = [...allResources];

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
      const typeForComparison = selectedTypeForSubject
        .toLowerCase()
        .replace(/\s+/g, "");

      processedResources = processedResources.filter((resource) => {
        let matches = true;
        if (numericGrade && resource.grade !== numericGrade) matches = false;
        if (resource.subject.toLowerCase() !== subjectForTypeView.toLowerCase())
          matches = false;
        if (resource.type !== typeForComparison) matches = false;
        return matches;
      });
      finalFilteredResources = processedResources;
    } else if (currentView === "filtersAndGrades") {
      shouldDisplayResources = !!(
        searchQuery.trim() ||
        selectedGrade ||
        selectedType
      );
      let tempResources = [...processedResources];

      if (selectedGrade) {
        const numericGrade = parseInt(selectedGrade.split(" ")[1], 10);
        tempResources = tempResources.filter(
          (resource) => resource.grade === numericGrade,
        );
      }
      if (selectedYear) {
        tempResources = tempResources.filter(
          (resource) => resource.year?.toString() === selectedYear,
        );
      }
      if (selectedTerm) {
        const termNumber = parseInt(selectedTerm.split(" ")[1], 10);
        tempResources = tempResources.filter(
          (resource) => resource.term === termNumber,
        );
      }
      if (selectedType) {
        const typeForComparison = selectedType
          .toLowerCase()
          .replace(/\s+/g, "");
        tempResources = tempResources.filter(
          (resource) => resource.type === typeForComparison,
        );
      }
      if (selectedSubject) {
        tempResources = tempResources.filter(
          (resource) =>
            resource.subject.toLowerCase() === selectedSubject.toLowerCase(),
        );
      }

      finalFilteredResources = tempResources;
    }

    setFilteredResources(shouldDisplayResources ? finalFilteredResources : []);
    setIsLoadingResources(false);
  }, [
    searchQuery,
    selectedGrade,
    selectedYear,
    selectedTerm,
    selectedType,
    selectedSubject,
    currentView,
    gradeForSubjectView,
    subjectForTypeView,
    selectedTypeForSubject,
    allResources,
  ]);

  const handleGradeCardClick = (grade: string) => {
    const gradeKey = `grade-${grade.split(" ")[1]}`;
    setGradeForSubjectView(gradeKey);
    setCurrentView("selectSubjectView");
  };

  const handleSubjectCardClick = (subject: string) => {
    setSubjectForTypeView(subject);
    setCurrentView("selectTypeForSubjectView");
  };

  const handleTypeCardClick = (type: string) => {
    setSelectedTypeForSubject(type);
  };

  const handleBack = () => {
    if (currentView === "selectTypeForSubjectView") {
      setSubjectForTypeView("");
      setSelectedTypeForSubject("");
      setCurrentView("selectSubjectView");
    } else if (currentView === "selectSubjectView") {
      setGradeForSubjectView("");
      setSubjectsToDisplay([]);
      setCurrentView("filtersAndGrades");
    }
    setFilteredResources([]);
  };

  const renderSubjectGroups = (
    subjectGroups: GroupedSubjects | StreamedSubjects,
    isStreamed: boolean,
  ) => {
    return Object.keys(subjectGroups).map((key) => {
      const groupName = key;
      const subjectsInGroup = (subjectGroups as any)[groupName];
      let title = groupName;
      if (!isStreamed) {
        if (groupName === "compulsory") title = "Compulsory Subjects";
        if (groupName.startsWith("optionalGroup"))
          title = `Group ${groupName.replace("optionalGroup", "")} Basket`;
      }

      return (
        <div
          key={groupName}
          className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow"
        >
          <h3 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-300 capitalize">
            {title}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {subjectsInGroup.map((subject: string) => (
              <ResourceCard
                key={subject}
                title={subject}
                type="subject"
                onClick={() => handleSubjectCardClick(subject)}
                icon={<BookOpen className="h-8 w-8 text-green-500" />}
              />
            ))}
          </div>
        </div>
      );
    });
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "filtersAndGrades":
        return (
          <>
            <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="md:col-span-2 lg:col-span-3">
                  <Input
                    type="text"
                    placeholder="Search for resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-base"
                  />
                </div>
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
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

                {selectedType === "past-paper" && (
                  <>
                    <Select
                      value={selectedYear}
                      onValueChange={setSelectedYear}
                    >
                      <SelectTrigger>
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
                    <Select
                      value={selectedTerm}
                      onValueChange={setSelectedTerm}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Term" />
                      </SelectTrigger>
                      <SelectContent>
                        {terms.map((term) => (
                          <SelectItem key={term} value={term}>
                            {term}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                )}

                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>

            {filteredResources.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    title={resource.title}
                    type={resource.type}
                    subject={resource.subject}
                    grade={resource.grade}
                    year={resource.year}
                    term={resource.term}
                    medium={resource.medium}
                    file_url={resource.file_url}
                  />
                ))}
              </div>
            )}

            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
                Or Select a Grade to Browse
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {grades.map((grade) => (
                  <ResourceCard
                    key={grade}
                    title={grade}
                    type="grade"
                    onClick={() => handleGradeCardClick(grade)}
                    icon={<Layers className="h-10 w-10 text-blue-500" />}
                  />
                ))}
              </div>
            </div>
          </>
        );
      case "selectSubjectView": {
        const gradeKey = gradeForSubjectView;
        const gradeNum = gradeKey ? parseInt(gradeKey.split("-")[1]) : 0;
        let subjectsToRender;
        let isStreamed = false;

        if (gradeNum >= 12) {
          subjectsToRender = gradeStreamSubjects[gradeKey];
          isStreamed = true;
        } else if (gradeNum >= 10) {
          subjectsToRender = gradePastPaperSubjects[gradeKey];
        } else {
          subjectsToRender = gradeTextbookSubjects[gradeKey] || [];
        }

        return (
          <section>
            <div className="flex items-center mb-6">
              <Button
                variant="outline"
                size="icon"
                onClick={handleBack}
                className="mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Select Subject for Grade {gradeNum}
              </h2>
            </div>
            {Array.isArray(subjectsToRender) ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6 md:gap-8">
                {subjectsToRender.map((subject) => (
                  <ResourceCard
                    key={subject}
                    title={subject}
                    type="subject"
                    onClick={() => handleSubjectCardClick(subject)}
                    icon={<BookOpen className="h-8 w-8 text-green-500" />}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {renderSubjectGroups(subjectsToRender, isStreamed)}
              </div>
            )}
          </section>
        );
      }
      case "selectTypeForSubjectView": {
        const typesForSubject = ["Textbook", "Past Paper", "Other"];
        return (
          <section>
            <div className="flex items-center mb-6">
              <Button
                variant="outline"
                size="icon"
                onClick={handleBack}
                className="mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Select Type for {subjectForTypeView}
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6 md:gap-8 mb-8">
              {typesForSubject.map((type) => (
                <ResourceCard
                  key={type}
                  title={type}
                  type="type"
                  onClick={() => handleTypeCardClick(type)}
                  icon={
                    type === "Textbook" ? (
                      <BookMarked className="h-8 w-8 text-purple-500" />
                    ) : type === "Past Paper" ? (
                      <FileText className="h-8 w-8 text-yellow-500" />
                    ) : (
                      <List className="h-8 w-8 text-indigo-500" />
                    )
                  }
                  isSelected={selectedTypeForSubject === type}
                />
              ))}
            </div>
            {isLoadingResources && (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
              </div>
            )}
            {!isLoadingResources && filteredResources.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    title={resource.title}
                    type={resource.type}
                    subject={resource.subject}
                    grade={resource.grade}
                    year={resource.year}
                    term={resource.term}
                    medium={resource.medium}
                    file_url={resource.file_url}
                  />
                ))}
              </div>
            )}
            {!isLoadingResources &&
              filteredResources.length === 0 &&
              selectedTypeForSubject && (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500">
                    No {selectedTypeForSubject.toLowerCase()} resources found
                    for {subjectForTypeView}.
                  </p>
                </div>
              )}
          </section>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500 dark:from-blue-400 dark:to-green-400 sm:text-5xl">
            LearnFun SL Resources
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
            Find past papers, textbooks, and other educational materials.
          </p>
        </header>
        <div className="p-4 sm:p-6 md:p-8 bg-white dark:bg-gray-900/50 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 min-h-[500px]">
          {renderCurrentView()}
        </div>
      </div>
    </div>
  );
}
