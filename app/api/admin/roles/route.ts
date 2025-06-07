import { NextResponse, NextRequest } from "next/server";

// Mock data for roles and permissions
let mockRoles = [
  {
    id: "role_superadmin",
    name: "Superadmin",
    description: "Full access to all system features and settings.",
    permissions: [
      "manage_users",
      "manage_content",
      "manage_settings",
      "manage_roles",
      "view_analytics",
    ],
  },
  {
    id: "role_editor",
    name: "Editor",
    description: "Can manage content, upload resources, and view analytics.",
    permissions: ["manage_content", "view_analytics"],
  },
  {
    id: "role_moderator",
    name: "Content Moderator",
    description: "Can review and approve/reject content submissions.",
    permissions: ["manage_content_moderation"],
  },
];

const allPermissions = [
  { id: "manage_users", label: "Manage Users" },
  { id: "manage_content", label: "Manage Content" },
  { id: "manage_content_moderation", label: "Moderate Content" },
  { id: "manage_settings", label: "Manage Settings" },
  { id: "manage_roles", label: "Manage Roles" },
  { id: "view_analytics", label: "View Analytics" },
  { id: "manage_notifications", label: "Send Notifications" },
];

// GET /api/admin/roles - List all roles or a specific role by ID
// GET /api/admin/roles?permissions=true - List all available permissions
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roleId = searchParams.get("id");
  const listPermissions = searchParams.get("permissions");

  // TODO: Add authentication and authorization checks (admin only)

  if (listPermissions === "true") {
    return NextResponse.json(allPermissions);
  }

  if (roleId) {
    const role = mockRoles.find((r) => r.id === roleId);
    if (role) {
      return NextResponse.json(role);
    } else {
      return NextResponse.json({ message: "Role not found" }, { status: 404 });
    }
  }
  return NextResponse.json(mockRoles);
}

// POST /api/admin/roles - Create a new role
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // TODO: Add authentication and authorization checks (superadmin only)
    // TODO: Add input validation

    const { name, description, permissions } = body;
    if (!name || !description) {
      return NextResponse.json(
        { message: "Missing required fields: name, description" },
        { status: 400 },
      );
    }

    const newRole = {
      id: `role_${name.toLowerCase().replace(/\s+/g, "_")}`,
      name,
      description,
      permissions: permissions || [], // Default to empty permissions array
    };

    if (mockRoles.find((r) => r.id === newRole.id)) {
      return NextResponse.json(
        { message: "Role with this ID already exists" },
        { status: 409 },
      );
    }

    mockRoles.push(newRole);
    console.log("Role created:", newRole);
    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    console.error("Error creating role:", error);
    return NextResponse.json(
      { message: "Error creating role", error: (error as Error).message },
      { status: 500 },
    );
  }
}

// PUT /api/admin/roles - Update an existing role (by ID in query or body)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const roleIdFromQuery = searchParams.get("id");
    const roleIdFromBody = body.id;
    const roleId = roleIdFromQuery || roleIdFromBody;

    // TODO: Add authentication and authorization checks (superadmin only)
    // TODO: Add input validation

    if (!roleId) {
      return NextResponse.json(
        { message: "Role ID is required for update" },
        { status: 400 },
      );
    }

    const roleIndex = mockRoles.findIndex((r) => r.id === roleId);
    if (roleIndex === -1) {
      return NextResponse.json({ message: "Role not found" }, { status: 404 });
    }

    // Prevent modification of superadmin role name/id for safety, permissions can be changed
    if (
      mockRoles[roleIndex].id === "role_superadmin" &&
      (body.name || body.id !== "role_superadmin")
    ) {
      // Allow changing description or permissions for superadmin
      if (body.name && body.name !== mockRoles[roleIndex].name) {
        return NextResponse.json(
          { message: "Cannot change the name of the Superadmin role." },
          { status: 403 },
        );
      }
    }

    const updatedRole = { ...mockRoles[roleIndex], ...body };
    mockRoles[roleIndex] = updatedRole;
    console.log("Role updated:", updatedRole);
    return NextResponse.json(updatedRole);
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { message: "Error updating role", error: (error as Error).message },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/roles - Delete a role by ID
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roleId = searchParams.get("id");

  // TODO: Add authentication and authorization checks (superadmin only)

  if (!roleId) {
    return NextResponse.json(
      { message: "Role ID is required for deletion" },
      { status: 400 },
    );
  }

  if (roleId === "role_superadmin") {
    return NextResponse.json(
      { message: "Cannot delete the Superadmin role" },
      { status: 403 },
    );
  }

  const initialLength = mockRoles.length;
  mockRoles = mockRoles.filter((r) => r.id !== roleId);

  if (mockRoles.length < initialLength) {
    console.log("Role deleted:", roleId);
    // TODO: Handle users assigned to this role (e.g., reassign to a default role or restrict access)
    return NextResponse.json({ message: "Role deleted successfully" });
  } else {
    return NextResponse.json(
      { message: "Role not found or already deleted" },
      { status: 404 },
    );
  }
}
