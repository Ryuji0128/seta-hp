export const USER_ROLES = ["ADMIN", "EDITOR", "VIEWER"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export function isAdminRole(role: unknown): role is "ADMIN" {
  return role === "ADMIN";
}

/** ADMINを含め、管理リソースを編集できるroleか判定する。 */
export function isEditorRole(role: unknown): role is "ADMIN" | "EDITOR" {
  return role === "ADMIN" || role === "EDITOR";
}
