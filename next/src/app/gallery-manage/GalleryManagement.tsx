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
import { useCallback } from "react";
import ImageUpload from "@/components/ImageUpload";
import DeleteConfirmDialog from "@/components/manage/DeleteConfirmDialog";
import ResourceActions from "@/components/manage/ResourceActions";
import FormDialog from "@/components/manage/FormDialog";
import ResourceTable, { type ResourceColumn } from "@/components/manage/ResourceTable";
import { useCrudResource } from "@/lib/hooks/useCrudResource";
import { useResourceDelete } from "@/lib/hooks/useResourceDelete";
import { useResourceEditor } from "@/lib/hooks/useResourceEditor";
import { getManagementPermissions } from "@/lib/management-permissions";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { GALLERY_CATEGORIES, getGalleryCategoryLabel } from "@/lib/constants/categories";
import type { Work } from "@/lib/types/work";

interface GalleryManagementProps {
  session: Session;
}

interface WorkForm {
  title: string;
  description: string;
  category: string;
  tags: string;
  image: string;
  isPublished: boolean;
}

const createWorkForm = (): WorkForm => ({
  title: "",
  description: "",
  category: GALLERY_CATEGORIES[0].value,
  tags: "",
  image: "",
  isPublished: true,
});

const editWorkForm = (work: Work): WorkForm => ({
  title: work.title,
  description: work.description,
  category: work.category,
  tags: work.tags,
  image: work.image || "",
  isPublished: work.isPublished,
});

const GalleryManagement: React.FC<GalleryManagementProps> = ({ session }) => {
  const { items: works, loading, save, remove } = useCrudResource<Work>({
    endpoint: "/api/works",
    listUrl: "/api/works?includeUnpublished=true",
    listKey: "works",
    label: "作品",
  });
  const isMobile = useIsMobile();

  const { canEdit, canDelete } = getManagementPermissions(session?.user?.role);
  const { deleteDialogOpen, requestDelete, cancelDelete, confirmDelete } =
    useResourceDelete(remove);

  const saveWork = useCallback((form: WorkForm, id?: number) => save({
    title: form.title,
    description: form.description,
    category: form.category,
    tags: form.tags,
    image: form.image || null,
    isPublished: form.isPublished,
  }, id), [save]);
  const editor = useResourceEditor<Work, WorkForm>({
    createForm: createWorkForm,
    editForm: editWorkForm,
    save: saveWork,
  });

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
        onCreate={canEdit ? editor.openCreate : undefined}
        actions={
          canEdit
            ? (work) => (
                <ResourceActions
                  mode="icon"
                  primaryLabel="作品を編集"
                  onPrimary={() => editor.openEdit(work)}
                  onDelete={canDelete ? () => requestDelete(work.id) : undefined}
                />
              )
            : undefined
        }
      />

      {/* 作成/編集ダイアログ */}
      <FormDialog
        open={editor.dialogOpen}
        title={editor.selectedResource ? "作品を編集" : "作品を追加"}
        submitLabel={editor.selectedResource ? "更新" : "追加"}
        submitDisabled={!editor.form.title || !editor.form.description}
        onClose={editor.close}
        onSubmit={editor.submit}
      >
        <TextField
          label="タイトル"
          value={editor.form.title}
          onChange={(e) => editor.setField("title", e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="説明"
          value={editor.form.description}
          onChange={(e) => editor.setField("description", e.target.value)}
          fullWidth
          multiline
          rows={3}
          required
        />
        <FormControl fullWidth>
          <InputLabel>カテゴリ</InputLabel>
          <Select
            value={editor.form.category}
            label="カテゴリ"
            onChange={(e) => editor.setField("category", e.target.value)}
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
          value={editor.form.tags}
          onChange={(e) => editor.setField("tags", e.target.value)}
          fullWidth
          placeholder="例: カード, ポケモン, アクリル"
        />
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            画像
          </Typography>
          <ImageUpload
            value={editor.form.image}
            onChange={(image) => editor.setField("image", image)}
          />
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={editor.form.isPublished}
              onChange={(e) => editor.setField("isPublished", e.target.checked)}
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
