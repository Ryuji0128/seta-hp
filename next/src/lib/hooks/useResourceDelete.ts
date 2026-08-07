import { useState } from "react";

/** CRUD管理画面で共通する削除対象・確認ダイアログ・削除確定処理。 */
export function useResourceDelete(remove: (id: number) => Promise<boolean>) {
  const [targetId, setTargetId] = useState<number | null>(null);

  const requestDelete = (id: number) => setTargetId(id);
  const cancelDelete = () => setTargetId(null);
  const confirmDelete = async () => {
    if (targetId === null) return;
    if (await remove(targetId)) setTargetId(null);
  };

  return {
    deleteDialogOpen: targetId !== null,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}
