"use server";

import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import { revalidatePath } from "next/cache";

import { Content } from "@/types/resources";

const resourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["pastpaper", "textbook", "other"]),
  subject: z.string().min(1, "Subject is required"),
  grade: z.coerce.number().min(1).max(13),
  year: z.coerce.number().optional().nullable(),
  term: z.coerce.number().optional().nullable(),
  medium: z.enum(["english", "sinhala", "tamil"]),
  file_url: z.string().url("Please enter a valid URL"),
});

export type FormState = {
  message: string;
  errors?: Record<string, string[]>;
  success: boolean;
};

export async function addResource(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const validatedFields = resourceSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { title, type, subject, grade, year, term, medium, file_url } =
    validatedFields.data;

  const newResource: Content = {
    id: `res-${Date.now()}`,
    title,
    type,
    subject,
    grade,
    year,
    term,
    medium,
    file_url,
    metadata: {},
    created_at: new Date().toISOString(),
  };

  try {
    const jsonPath = path.join(process.cwd(), "lib", "data", "resources.json");
    const fileContents = await fs.readFile(jsonPath, "utf8");
    const resources: Content[] = JSON.parse(fileContents);
    resources.unshift(newResource); // Add new resource to the beginning
    await fs.writeFile(jsonPath, JSON.stringify(resources, null, 2));

    revalidatePath("/resources");
    revalidatePath("/admin/dashboard");

    return {
      message: "Resource added successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Failed to add resource:", error);
    return {
      message: "An unexpected error occurred. Could not save the resource.",
      success: false,
    };
  }
}
