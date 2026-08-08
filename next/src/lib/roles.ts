const USER_ROLES = ["ADMIN", "EDITOR", "VIEWER"] as const;
export type UserRole = (typeof USER_ROLES)[number];
export const DEFAULT_USER_ROLE: UserRole = "VIEWER";

function isUserRole(role: unknown): role is UserRole {
  return (USER_ROLES as readonly unknown[]).includes(role);
}

export function normalizeUserRole(role: unknown): UserRole {
  return isUserRole(role) ? role : DEFAULT_USER_ROLE;
}

export function isAdminRole(role: unknown): role is "ADMIN" {
  return role === "ADMIN";
}

/** ADMINを含め、管理リソースを編集できるroleか判定する。 */
export function isEditorRole(role: unknown): role is "ADMIN" | "EDITOR" {
  return role === "ADMIN" || role === "EDITOR";
}
