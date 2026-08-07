"use client";

import { Box, TextField, Typography } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { Session } from "next-auth";
import { useState } from "react";
import DeleteConfirmDialog from "@/components/manage/DeleteConfirmDialog";
import ResourceActions from "@/components/manage/ResourceActions";
import FormDialog from "@/components/manage/FormDialog";
import ResourceTable, { type ResourceColumn } from "@/components/manage/ResourceTable";
import { useCrudResource } from "@/lib/hooks/useCrudResource";
import { useResourceDelete } from "@/lib/hooks/useResourceDelete";
import { getManagementPermissions } from "@/lib/management-permissions";
import type { News } from "@/lib/types/news";

interface NewsManagementProps {
  session: Session;
}

const NewsManagement: React.FC<NewsManagementProps> = ({ session }) => {
  const { items: newsList, loading, save, remove } = useCrudResource<News>({
    endpoint: "/api/news",
    listKey: "news",
    label: "お知らせ",
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  // フォーム用
  const [formTitle, setFormTitle] = useState("");
  const [formContents, setFormContents] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formUrl, setFormUrl] = useState("");

  const { canEdit, canDelete } = getManagementPermissions(session?.user?.role);
  const { deleteDialogOpen, requestDelete, cancelDelete, confirmDelete } =
    useResourceDelete(remove);

  const resetForm = () => {
    setFormTitle("");
    setFormContents("");
    setFormDate("");
    setFormUrl("");
    setSelectedNews(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setFormDate(dayjs().format("YYYY-MM-DD"));
    setDialogOpen(true);
  };

  const openEditDialog = (news: News) => {
    setSelectedNews(news);
    setFormTitle(news.title);
    setFormContents(news.contents?.text || "");
    setFormDate(dayjs(news.date).format("YYYY-MM-DD"));
    setFormUrl(news.url || "");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      title: formTitle,
      contents: { text: formContents },
      date: formDate,
      url: formUrl || null,
    };

    const ok = await save(payload, selectedNews?.id);
    if (ok) {
      setDialogOpen(false);
      resetForm();
    }
  };

  const columns: ResourceColumn<News>[] = [
    {
      header: "日付",
      align: "center",
      render: (news) => dayjs(news.date).format("YYYY/MM/DD"),
    },
    {
      header: "タイトル",
      render: (news) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {news.title}
        </Typography>
      ),
    },
    {
      header: "内容",
      hideOnMobile: true,
      render: (news) => (
        <Box
          sx={{
            maxWidth: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {news.contents?.text || ""}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <ResourceTable
        items={newsList}
        columns={columns}
        loading={loading}
        emptyMessage="お知らせはありません"
        pageSize={10}
        onCreate={canEdit ? openCreateDialog : undefined}
        actions={
          canEdit
            ? (news) => (
                <ResourceActions
                  primaryLabel="編集"
                  onPrimary={() => openEditDialog(news)}
                  onDelete={canDelete ? () => requestDelete(news.id) : undefined}
                />
              )
            : undefined
        }
      />

      {/* 作成/編集ダイアログ */}
      <FormDialog
        open={dialogOpen}
        title={selectedNews ? "お知らせ編集" : "お知らせ新規作成"}
        submitLabel={selectedNews ? "更新" : "作成"}
        submitDisabled={!formTitle || !formContents || !formDate}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSave}
      >
        <TextField
          label="日付"
          type="date"
          value={formDate}
          onChange={(e) => setFormDate(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="タイトル"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="内容"
          value={formContents}
          onChange={(e) => setFormContents(e.target.value)}
          fullWidth
          multiline
          rows={4}
          required
        />
        <TextField
          label="リンクURL（任意）"
          value={formUrl}
          onChange={(e) => setFormUrl(e.target.value)}
          fullWidth
        />
      </FormDialog>

      {/* 削除確認ダイアログ */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        title="お知らせを削除"
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />
    </Box>
  );
};

export default NewsManagement;
