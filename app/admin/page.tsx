import { redirect } from "next/navigation";

export default function AdminRootPage() {
  // Redirect to the main dashboard overview by default
  redirect("/admin/dashboard");

  // This part will not be reached due to the redirect,
  // but it's good practice to return null or a minimal component.
  return null;
}
