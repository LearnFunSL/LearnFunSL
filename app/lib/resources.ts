// app/lib/resources.ts
import resourcesData from "./data/resources.json";
import { Resource } from "./types";

// In a real application, this might fetch from an API
export const getAllResources = async (): Promise<Resource[]> => {
  // Simulate async fetch
  await new Promise((resolve) => setTimeout(resolve, 100));
  return resourcesData as Resource[];
};

export const getResourcesByGrade = (
  resources: Resource[],
  grade: number,
): Resource[] => {
  return resources.filter((resource) => resource.grade === grade);
};

export const getSubjectsForGrade = (
  resources: Resource[],
  grade: number,
): string[] => {
  const gradeResources = getResourcesByGrade(resources, grade);
  const subjects = new Set(gradeResources.map((r) => r.subject));
  return Array.from(subjects).sort();
};

export const getTypesForSubject = (
  resources: Resource[],
  grade: number,
  subject: string,
): string[] => {
  const subjectResources = resources.filter(
    (r) => r.grade === grade && r.subject === subject,
  );
  const types = new Set(subjectResources.map((r) => r.type));
  return Array.from(types).sort();
};

export const filterResources = (
  resources: Resource[],
  grade: number | null,
  subject: string | null,
  type: string | null,
): Resource[] => {
  return resources.filter(
    (resource) =>
      (grade === null || resource.grade === grade) &&
      (subject === null || resource.subject === subject) &&
      (type === null || resource.type === type),
  );
};
