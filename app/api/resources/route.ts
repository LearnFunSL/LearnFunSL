import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // In a real application, you would fetch data from a database or other source.
  const resources = [
    { id: 1, name: "Resource A" },
    { id: 2, name: "Resource B" },
  ];

  return NextResponse.json(resources);
}
