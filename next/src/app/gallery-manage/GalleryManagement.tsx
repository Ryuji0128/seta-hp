"use client";

import {
  Box,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Session } from "next-auth";
import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import DeleteConfirmDialog from "@/components/manage/DeleteConfirmDialog";
import ResourceActions from "@/components/manage/ResourceActions";
import FormDialog from "@/components/manage/FormDialog";
import ResourceTable, { type ResourceColumn } from "@/components/manage/ResourceTable";
import { useCrudResource } from "@/lib/hooks/useCrudResource";
import { useResourceDelete } from "@/lib/hooks/useResourceDelete";
import { getManagementPermissions } from "@/lib/management-permissions";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { GALLERY_CATEGORIES, getGalleryCategoryLabel } from "@/lib/constants/categories";
import type { Work } from "@/lib/types/work";

interface GalleryManagementProps {
  session: Session;
}

const GalleryManagement: React.FC<GalleryManagementProps> = ({ session }) => {
  const { items: works, loading, save, remove } = useCrudResource<Work>({
    endpoint: "/api/works",
    listUrl: "/api/works?includeUnpublished=true",
    listKey: "works",
    label: "作品",
  });
  const isMobile = useIsMobile();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

  // フォーム用
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState<string>(GALLERY_CATEGORIES[0].value);
  const [formTags, setFormTags] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formIsPublished, setFormIsPublished] = useState(true);

  const { canEdit, canDelete } = getManagementPermissions(session?.user?.role);
  const { deleteDialogOpen, requestDelete, cancelDelete, confirmDelete } =
    useResourceDelete(remove);

  const resetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFormCategory(GALLERY_CATEGORIES[0].value);
    setFormTags("");
    setFormImage("");
    setFormIsPublished(true);
    setSelectedWork(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (work: Work) => {
    setSelectedWork(work);
    setFormTitle(work.title);
    setFormDescription(work.description);
    setFormCategory(work.category);
    setFormTags(work.tags);
    setFormImage(work.image || "");
    setFormIsPublished(work.isPublished);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      title: formTitle,
      description: formDescription,
      category: formCategory,
      tags: formTags,
      image: formImage || null,
      isPublished: formIsPublished,
    };

    const ok = await save(payload, selectedWork?.id);
    if (ok) {
      setDialogOpen(false);
      resetForm();
    }
  };

  const columns: ResourceColumn<Work>[] = [
    {
      header: "タイトル",
      render: (work) => (
        <>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {work.title}
          </Typography>
          {isMobile && (
            <Typography variant="caption" color="text.secondary">
              {getGalleryCategoryLabel(work.category)}
            </Typography>
          )}
        </>
      ),
    },
    {
      header: "カテゴリ",
      hideOnMobile: true,
      render: (work) => (
        <Chip label={getGalleryCategoryLabel(work.category)} size="small" color="info" />
      ),
    },
    {
      header: "公開",
      render: (work) => (
        <Chip
          label={work.isPublished ? "公開" : "非公開"}
          size="small"
          color={work.isPublished ? "primary" : "default"}
        />
      ),
    },
  ];

  return (
    <Box>
      <ResourceTable
        items={works}
        columns={columns}
        loading={loading}
        emptyMessage="作品がありません"
        onCreate={canEdit ? openCreateDialog : undefined}
        actions={
          canEdit
            ? (work) => (
                <ResourceActions
                  mode="icon"
                  primaryLabel="作品を編集"
                  onPrimary={() => openEditDialog(work)}
                  onDelete={canDelete ? () => requestDelete(work.id) : undefined}
                />
              )
            : undefined
        }
      />

      {/* 作成/編集ダイアログ */}
      <FormDialog
        open={dialogOpen}
        title={selectedWork ? "作品を編集" : "作品を追加"}
        submitLabel={selectedWork ? "更新" : "追加"}
        submitDisabled={!formTitle || !formDescription}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSave}
      >
        <TextField
          label="タイトル"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="説明"
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
          required
        />
        <FormControl fullWidth>
          <InputLabel>カテゴリ</InputLabel>
          <Select
            value={formCategory}
            label="カテゴリ"
            onChange={(e) => setFormCategory(e.target.value)}
          >
            {GALLERY_CATEGORIES.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="タグ（カンマ区切り）"
          value={formTags}
          onChange={(e) => setFormTags(e.target.value)}
          fullWidth
          placeholder="例: カード, ポケモン, アクリル"
        />
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            画像
          </Typography>
          <ImageUpload value={formImage} onChange={setFormImage} />
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={formIsPublished}
              onChange={(e) => setFormIsPublished(e.target.checked)}
            />
          }
          label="公開する"
        />
      </FormDialog>

      {/* 削除確認ダイアログ */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        title="作品を削除"
        message="この作品を削除してもよろしいですか？"
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />
    </Box>
  );
};

export default GalleryManagement;
