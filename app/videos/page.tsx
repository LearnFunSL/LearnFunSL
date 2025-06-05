"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  ArrowLeft,
  Tag,
  Layers,
  BookMarked,
  FileText,
  List,
  Video as VideoIcon, // Renamed to avoid conflict with HTMLVideoElement
} from "lucide-react";
import {
  GroupedSubjects,
  StreamedSubjects,
  gradePastPaperSubjects,
  gradeStreamSubjects,
  gradeTextbookSubjects,
} from "@/lib/subject-data";

const grades = Array.from({ length: 13 }, (_, i) => `Grade ${i + 1}`);

export default function VideosPage() {
  const [currentView, setCurrentView] = useState("selectGradeView"); // selectGradeView, selectSubjectView, displayVideosView
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [gradeForSubjectView, setGradeForSubjectView] = useState<string | null>(null);
  const [subjectsForGrade, setSubjectsForGrade] = useState<string[]>([]);
  const [subjectGroupsForGrade, setSubjectGroupsForGrade] = useState<GroupedSubjects | null>(null);
  const [streamSubjectsForGrade, setStreamSubjectsForGrade] = useState<StreamedSubjects | null>(null);

  useEffect(() => {
    if (currentView !== "selectGradeView") {
      window.scrollTo(0, 0);
    }
  }, [currentView]);

  useEffect(() => {
    if (gradeForSubjectView) {
      const gradeNumber = parseInt(gradeForSubjectView.split("-")[1]);
      if (gradeNumber >= 1 && gradeNumber <= 9) {
        setSubjectsForGrade(gradeTextbookSubjects[gradeForSubjectView] || []);
        setSubjectGroupsForGrade(null);
        setStreamSubjectsForGrade(null);
      } else if (gradeNumber === 10 || gradeNumber === 11) {
        setSubjectGroupsForGrade(gradePastPaperSubjects[gradeForSubjectView] || null);
        setSubjectsForGrade([]);
        setStreamSubjectsForGrade(null);
      } else if (gradeNumber === 12 || gradeNumber === 13) {
        setStreamSubjectsForGrade(gradeStreamSubjects[gradeForSubjectView] || null);
        setSubjectsForGrade([]);
        setSubjectGroupsForGrade(null);
      }
    }
  }, [gradeForSubjectView]);

  const handleGradeSelect = (grade: string) => {
    const gradeKey = `grade-${grade.split(" ")[1]}`;
    setSelectedGrade(grade);
    setGradeForSubjectView(gradeKey);
    setCurrentView("selectSubjectView");
  };

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setCurrentView("displayVideosView");
  };

  const handleBack = () => {
    if (currentView === "displayVideosView") {
      setCurrentView("selectSubjectView");
      setSelectedSubject(null);
    } else if (currentView === "selectSubjectView") {
      setCurrentView("selectGradeView");
      setSelectedGrade(null);
      setGradeForSubjectView(null);
      setSubjectsForGrade([]);
      setSubjectGroupsForGrade(null);
      setStreamSubjectsForGrade(null);
    }
  };

  const renderSelectGradeView = () => (
    <section>
      <h2 className="text-2xl font-semibold mb-6 text-center">Select Grade</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {grades.map((grade) => (
          <Card
            key={grade}
            className="hover:shadow-lg transition-shadow cursor-pointer transform hover:-translate-y-1 duration-300 ease-in-out bg-white rounded-xl overflow-hidden"
            onClick={() => handleGradeSelect(grade)}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 aspect-square">
              <VideoIcon className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mb-3" />
              <p className="text-md sm:text-lg font-medium text-center text-gray-700">{grade}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );

  const renderSubjectCard = (subject: string, icon?: React.ReactNode) => (
    <Card
      key={subject}
      className="hover:shadow-lg transition-shadow cursor-pointer transform hover:-translate-y-1 duration-300 ease-in-out bg-white rounded-xl overflow-hidden"
      onClick={() => handleSubjectSelect(subject)}
    >
      <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 aspect-square">
        {icon || <VideoIcon className="h-8 w-8 sm:h-10 sm:w-10 text-green-600 mb-2" />}
        <p className="text-sm sm:text-md font-medium text-center text-gray-700">{subject}</p>
      </CardContent>
    </Card>
  );

  const renderSelectSubjectView = () => {
    if (!selectedGrade) return null;
    const gradeNumber = parseInt(selectedGrade.split(" ")[1]);
    let titleText = `Subjects for ${selectedGrade}`;
    if (gradeNumber >= 12 && gradeNumber <= 13) titleText = `Streams for ${selectedGrade}`;

    return (
      <section>
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" onClick={handleBack} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-semibold text-gray-800">{titleText}</h2>
        </div>
        
        {subjectsForGrade.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6 md:gap-8">
            {subjectsForGrade.map((subject) => renderSubjectCard(subject))}
          </div>
        )}

        {subjectGroupsForGrade && (
          <div className="space-y-8">
            {Object.entries(subjectGroupsForGrade).map(([groupName, subjectsInGroup]) => (
              <div key={groupName} className="p-6 bg-blue-50 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4 text-blue-700 capitalize">
                  {(() => {
                    if (groupName === 'compulsory') return 'Compulsory Subjects';
                    if (groupName.startsWith('optionalGroup')) return `Group ${groupName.replace('optionalGroup', '')} Basket`;
                    return groupName; // Fallback
                  })()}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {subjectsInGroup.map((subject: string) => renderSubjectCard(subject))}
                </div>
              </div>
            ))}
          </div>
        )}

        {streamSubjectsForGrade && (
          <div className="space-y-8">
            {Object.entries(streamSubjectsForGrade).map(([streamName, subjectsInStream]) => (
              <div key={streamName} className="p-6 bg-green-50 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4 text-green-700">{streamName}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {subjectsInStream.map((subject: string) => renderSubjectCard(subject))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  const renderDisplayVideosView = () => {
    if (!selectedGrade || !selectedSubject) return null;
    return (
      <section>
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" onClick={handleBack} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-semibold text-gray-800">
            Videos for {selectedGrade} - {selectedSubject}
          </h2>
        </div>
        <div className="p-8 border rounded-lg bg-gray-50 text-center">
          <VideoIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600">
            Video content for {selectedSubject} ({selectedGrade}) will be displayed here.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            (Content coming soon!)
          </p>
        </div>
      </section>
    );
  };
  
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-br from-slate-50 to-sky-50">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500 sm:text-5xl">
            LearnFun SL Video Library
          </h1>
          <p className="mt-3 text-lg text-gray-600 sm:text-xl">
            Select a grade and subject to find educational videos.
          </p>
        </header>

        {currentView === "selectGradeView" && renderSelectGradeView()}
        {currentView === "selectSubjectView" && renderSelectSubjectView()}
        {currentView === "displayVideosView" && renderDisplayVideosView()}
      </div>
    </div>
  );
}