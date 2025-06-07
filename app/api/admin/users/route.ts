import { NextResponse, NextRequest } from "next/server";

// Mock user data - this would typically come from a database
let mockUsers = [
  {
    id: "usr_001",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Student",
    status: "Active",
    joinedDate: "2023-01-15",
  },
  {
    id: "usr_002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Teacher",
    status: "Active",
    joinedDate: "2022-11-20",
  },
  {
    id: "usr_003",
    name: "Admin User",
    email: "admin@learnfunsl.com",
    role: "Superadmin",
    status: "Active",
    joinedDate: "2022-10-01",
  },
];

// GET /api/admin/users - List all users or a specific user by ID
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("id");

  // TODO: Add authentication and authorization checks (admin only)

  if (userId) {
    const user = mockUsers.find((u) => u.id === userId);
    if (user) {
      return NextResponse.json(user);
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  }
  // TODO: Implement pagination and filtering
  return NextResponse.json(mockUsers);
}

// POST /api/admin/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // TODO: Add authentication and authorization checks (admin only)
    // TODO: Add input validation (e.g., using Zod)

    const { name, email, role, status } = body;
    if (!name || !email || !role) {
      return NextResponse.json(
        { message: "Missing required fields: name, email, role" },
        { status: 400 },
      );
    }

    const newUser = {
      id: `usr_${String(Date.now()).slice(-3)}${Math.floor(Math.random() * 100)}`, // Simple unique ID
      name,
      email,
      role,
      status: status || "Pending", // Default status
      joinedDate: new Date().toISOString().split("T")[0],
    };

    mockUsers.push(newUser);
    console.log("User created:", newUser);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Error creating user", error: (error as Error).message },
      { status: 500 },
    );
  }
}

// PUT /api/admin/users - Update an existing user (by ID in query or body)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const userIdFromQuery = searchParams.get("id");
    const userIdFromBody = body.id;
    const userId = userIdFromQuery || userIdFromBody;

    // TODO: Add authentication and authorization checks (admin only)
    // TODO: Add input validation

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required for update" },
        { status: 400 },
      );
    }

    const userIndex = mockUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updatedUser = { ...mockUsers[userIndex], ...body };
    mockUsers[userIndex] = updatedUser;
    console.log("User updated:", updatedUser);
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Error updating user", error: (error as Error).message },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/users - Delete a user by ID
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("id");

  // TODO: Add authentication and authorization checks (admin only)

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required for deletion" },
      { status: 400 },
    );
  }

  const initialLength = mockUsers.length;
  mockUsers = mockUsers.filter((u) => u.id !== userId);

  if (mockUsers.length < initialLength) {
    console.log("User deleted:", userId);
    return NextResponse.json({ message: "User deleted successfully" });
  } else {
    return NextResponse.json(
      { message: "User not found or already deleted" },
      { status: 404 },
    );
  }
}
