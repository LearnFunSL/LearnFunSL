"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Video as VideoIcon, Clock } from "lucide-react";
import {
  GroupedSubjects,
  StreamedSubjects,
  gradePastPaperSubjects,
  gradeStreamSubjects,
  gradeTextbookSubjects,
} from "@/lib/subject-data";
import { videos as videoData } from "@/lib/videos-data";
import Image from "next/image";

const grades = Array.from({ length: 13 }, (_, i) => `Grade ${i + 1}`);

export default function VideosPage() {
  const [currentView, setCurrentView] = useState("selectGradeView"); // selectGradeView, selectSubjectView, displayVideosView
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [gradeForSubjectView, setGradeForSubjectView] = useState<string | null>(
    null,
  );
  const [subjectsForGrade, setSubjectsForGrade] = useState<string[]>([]);
  const [subjectGroupsForGrade, setSubjectGroupsForGrade] =
    useState<GroupedSubjects | null>(null);
  const [streamSubjectsForGrade, setStreamSubjectsForGrade] =
    useState<StreamedSubjects | null>(null);

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
        setSubjectGroupsForGrade(
          gradePastPaperSubjects[gradeForSubjectView] || null,
        );
        setSubjectsForGrade([]);
        setStreamSubjectsForGrade(null);
      } else if (gradeNumber === 12 || gradeNumber === 13) {
        setStreamSubjectsForGrade(
          gradeStreamSubjects[gradeForSubjectView] || null,
        );
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
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
        Select Grade
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {grades.map((grade) => (
          <Card
            key={grade}
            className="hover:shadow-lg transition-shadow cursor-pointer transform hover:-translate-y-1 duration-300 ease-in-out bg-white dark:bg-gray-800 rounded-xl overflow-hidden"
            onClick={() => handleGradeSelect(grade)}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 aspect-square">
              <VideoIcon className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 dark:text-blue-400 mb-3" />
              <p className="text-md sm:text-lg font-medium text-center text-gray-700 dark:text-gray-200">
                {grade}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );

  const renderSubjectCard = (subject: string, icon?: React.ReactNode) => (
    <Card
      key={subject}
      className="hover:shadow-lg transition-shadow cursor-pointer transform hover:-translate-y-1 duration-300 ease-in-out bg-white dark:bg-gray-800 rounded-xl overflow-hidden"
      onClick={() => handleSubjectSelect(subject)}
    >
      <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 aspect-square">
        {icon || (
          <VideoIcon className="h-8 w-8 sm:h-10 sm:w-10 text-green-600 dark:text-green-400 mb-2" />
        )}
        <p className="text-sm sm:text-md font-medium text-center text-gray-700 dark:text-gray-200">
          {subject}
        </p>
      </CardContent>
    </Card>
  );

  const renderSelectSubjectView = () => {
    if (!selectedGrade) return null;
    const gradeNumber = parseInt(selectedGrade.split(" ")[1]);
    let titleText = `Subjects for ${selectedGrade}`;
    if (gradeNumber >= 12 && gradeNumber <= 13)
      titleText = `Streams for ${selectedGrade}`;

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
            {titleText}
          </h2>
        </div>

        {subjectsForGrade.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6 md:gap-8">
            {subjectsForGrade.map((subject) => renderSubjectCard(subject))}
          </div>
        )}

        {subjectGroupsForGrade && (
          <div className="space-y-8">
            {Object.entries(subjectGroupsForGrade).map(
              ([groupName, subjectsInGroup]) => (
                <div
                  key={groupName}
                  className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow"
                >
                  <h3 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-300 capitalize">
                    {(() => {
                      if (groupName === "compulsory")
                        return "Compulsory Subjects";
                      if (groupName.startsWith("optionalGroup"))
                        return `Group ${groupName.replace(
                          "optionalGroup",
                          "",
                        )} Basket`;
                      return groupName; // Fallback
                    })()}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {(subjectsInGroup as string[]).map((subject: string) =>
                      renderSubjectCard(subject),
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        )}

        {streamSubjectsForGrade && (
          <div className="space-y-8">
            {Object.entries(streamSubjectsForGrade).map(
              ([streamName, subjectsInStream]) => (
                <div
                  key={streamName}
                  className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg shadow"
                >
                  <h3 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-300">
                    {streamName}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {(subjectsInStream as string[]).map((subject: string) =>
                      renderSubjectCard(subject),
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </section>
    );
  };

  const renderDisplayVideosView = () => {
    if (!selectedGrade || !selectedSubject) return null;

    const gradeNumber = parseInt(selectedGrade.split(" ")[1], 10);
    const videos = videoData.filter(
      (v) => v.grade === gradeNumber && v.subject === selectedSubject,
    );

    const formatDuration = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

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
            Videos for {selectedGrade} - {selectedSubject}
          </h2>
        </div>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <Card
                key={video.id}
                className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800 h-full flex flex-col"
              >
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${video.youtube_id}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-t-lg"
                  ></iframe>
                </div>
                <CardContent className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-2">
                      {video.title}
                    </h4>
                    {video.unit && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Unit: {video.unit}
                      </p>
                    )}
                  </div>
                  {video.duration && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{formatDuration(video.duration)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-8 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-center">
            <VideoIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-300">
              No videos available for {selectedSubject} in {selectedGrade} yet.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Please check back later!
            </p>
          </div>
        )}
      </section>
    );
  };

  const renderCurrentView = () => {
    if (currentView === "selectGradeView") {
      return renderSelectGradeView();
    } else if (currentView === "selectSubjectView") {
      return renderSelectSubjectView();
    } else if (currentView === "displayVideosView") {
      return renderDisplayVideosView();
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            LearnFunSL Video Library
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Explore our collection of educational videos for all grades and
            subjects.
          </p>
        </div>
        <div className="p-4 sm:p-6 md:p-8 bg-white dark:bg-gray-900/50 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 min-h-[400px]">
          {renderCurrentView()}
        </div>
      </div>
    </div>
  );
}
