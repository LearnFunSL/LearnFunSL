import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function AdminRootPage() {
  // Redirect to the main dashboard overview by default
  redirect("/admin/dashboard");
}
