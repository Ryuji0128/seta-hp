import { isAdminRole, isEditorRole } from "@/lib/roles";

interface ManagementPermissions {
  canEdit: boolean;
  canDelete: boolean;
}

/** 管理画面とAPIで共有するロールの意味をUI向けに変換する。 */
export function getManagementPermissions(role?: string | null): ManagementPermissions {
  return {
    canEdit: isEditorRole(role),
    canDelete: isAdminRole(role),
  };
}
