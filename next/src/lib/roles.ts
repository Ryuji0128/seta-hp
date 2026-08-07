export type UserRole = "ADMIN" | "EDITOR" | "VIEWER";

export function isAdminRole(role: unknown): role is "ADMIN" {
  return role === "ADMIN";
}

/** ADMINを含め、管理リソースを編集できるroleか判定する。 */
export function isEditorRole(role: unknown): role is "ADMIN" | "EDITOR" {
  return role === "ADMIN" || role === "EDITOR";
}
