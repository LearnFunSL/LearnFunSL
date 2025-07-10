import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Resource } from "@/types/resources";

export type GroupedResources = {
  [grade: string]: {
    [subject: string]: {
      [type: string]: Resource[];
    };
  };
};

export async function getGroupedResources() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.from("resources").select("*");

  if (error) {
    console.error("Error fetching resources:", error);
    return { data: null, error };
  }

  if (!data) {
    return { data: {}, error: null };
  }

  const groupedData = data.reduce<GroupedResources>((acc, resource) => {
    const { grade, subject, type } = resource;

    if (!grade || !subject || !type) return acc;

    const gradeStr = typeof grade === "number" ? `Grade ${grade}` : grade;

    if (!acc[gradeStr]) {
      acc[gradeStr] = {};
    }
    if (!acc[gradeStr][subject]) {
      acc[gradeStr][subject] = {};
    }
    if (!acc[gradeStr][subject][type]) {
      acc[gradeStr][subject][type] = [];
    }

    acc[gradeStr][subject][type].push(resource as Resource);

    return acc;
  }, {});

  return { data: groupedData, error: null };
}
