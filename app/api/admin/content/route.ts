import { NextResponse, NextRequest } from "next/server";

// Mock content data - this would typically come from a database
let mockContent = [
  {
    id: "cont_001",
    title: "Grade 10 Math Textbook",
    type: "Textbook",
    subject: "Mathematics",
    grade: 10,
    medium: "English",
    status: "Published",
    uploadDate: "2023-03-15",
    fileUrl: "/uploads/math_g10.pdf",
  },
  {
    id: "cont_002",
    title: "Intro to Physics Video",
    type: "Video",
    subject: "Physics",
    grade: 12,
    medium: "Sinhala",
    status: "Draft",
    uploadDate: "2023-04-20",
    fileUrl: "https://youtube.com/example",
  },
];

// GET /api/admin/content - List all content or specific content by ID
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const contentId = searchParams.get("id");

  // TODO: Add authentication and authorization checks (admin only)

  if (contentId) {
    const item = mockContent.find((c) => c.id === contentId);
    if (item) {
      return NextResponse.json(item);
    } else {
      return NextResponse.json(
        { message: "Content not found" },
        { status: 404 },
      );
    }
  }
  // TODO: Implement pagination, filtering (by type, subject, grade, status)
  return NextResponse.json(mockContent);
}

// POST /api/admin/content - Create new content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json(); // Or handle FormData for file uploads
    // TODO: Add authentication and authorization checks (admin only)
    // TODO: Add input validation (e.g., using Zod)
    // TODO: Handle actual file uploads to a storage service (e.g., Supabase Storage, S3)

    const { title, type, subject, grade, medium, status, fileUrl } = body;
    if (!title || !type || !subject || !grade || !medium) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const newContent = {
      id: `cont_${String(Date.now()).slice(-3)}${Math.floor(Math.random() * 100)}`, // Simple unique ID
      title,
      type,
      subject,
      grade: parseInt(grade, 10),
      medium,
      status: status || "Draft",
      uploadDate: new Date().toISOString().split("T")[0],
      fileUrl: fileUrl || "", // Placeholder for actual file URL after upload
    };

    mockContent.push(newContent);
    // In a real scenario, you might return the path to the uploaded file or its ID
    return NextResponse.json(newContent, { status: 201 });
  } catch (error) {
    console.error("Error creating content:", error);
    return NextResponse.json(
      { message: "Error creating content", error: (error as Error).message },
      { status: 500 },
    );
  }
}

// PUT /api/admin/content - Update existing content (by ID in query or body)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const contentIdFromQuery = searchParams.get("id");
    const contentIdFromBody = body.id;
    const contentId = contentIdFromQuery || contentIdFromBody;

    // TODO: Add authentication and authorization checks (admin only)
    // TODO: Add input validation
    // TODO: Handle updates to uploaded files if necessary

    if (!contentId) {
      return NextResponse.json(
        { message: "Content ID is required for update" },
        { status: 400 },
      );
    }

    const contentIndex = mockContent.findIndex((c) => c.id === contentId);
    if (contentIndex === -1) {
      return NextResponse.json(
        { message: "Content not found" },
        { status: 404 },
      );
    }

    const updatedContent = { ...mockContent[contentIndex], ...body };
    // Ensure grade is a number if updated
    if (body.grade) updatedContent.grade = parseInt(body.grade, 10);

    mockContent[contentIndex] = updatedContent;
    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error("Error updating content:", error);
    return NextResponse.json(
      { message: "Error updating content", error: (error as Error).message },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/content - Delete content by ID
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const contentId = searchParams.get("id");

  // TODO: Add authentication and authorization checks (admin only)
  // TODO: Handle deletion of associated files from storage

  if (!contentId) {
    return NextResponse.json(
      { message: "Content ID is required for deletion" },
      { status: 400 },
    );
  }

  const initialLength = mockContent.length;
  mockContent = mockContent.filter((c) => c.id !== contentId);

  if (mockContent.length < initialLength) {
    return NextResponse.json({ message: "Content deleted successfully" });
  } else {
    return NextResponse.json(
      { message: "Content not found or already deleted" },
      { status: 404 },
    );
  }
}
