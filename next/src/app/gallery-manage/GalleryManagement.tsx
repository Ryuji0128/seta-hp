"use client";

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import ImageUpload from "@/components/ImageUpload";

interface Work {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string;
  image: string | null;
  isPublished: boolean;
  createdAt: string;
}

interface GalleryManagementProps {
  session: Session;
}

const categoryOptions = [
  { value: "modeling", label: "3Dモデリング" },
  { value: "print", label: "3Dプリント製品" },
  { value: "laser", label: "レーザーカット" },
  { value: "mockup", label: "試作品" },
];

const GalleryManagement: React.FC<GalleryManagementProps> = ({ session }) => {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [workToDelete, setWorkToDelete] = useState<number | null>(null);

  // フォーム用
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("print");
  const [formTags, setFormTags] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formIsPublished, setFormIsPublished] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(`(max-width:${theme.breakpoints.values.sm}px)`);

  const userRole = (session?.user as { role?: string })?.role;
  const canEdit = userRole === "ADMIN" || userRole === "EDITOR";
  const canDelete = userRole === "ADMIN";

  const fetchWorks = useCallback(async () => {
    try {
      const res = await fetch("/api/works?includeUnpublished=true");
      const data = await res.json();
      setWorks(data.works || []);
    } catch (error) {
      console.error("作品一覧の取得に失敗:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  const resetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFormCategory("print");
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
    try {
      const data = {
        title: formTitle,
        description: formDescription,
        category: formCategory,
        tags: formTags,
        image: formImage || null,
        isPublished: formIsPublished,
      };

      const method = selectedWork ? "PUT" : "POST";
      const body = selectedWork
        ? { id: selectedWork.id, ...data }
        : data;

      const res = await fetch("/api/works", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "保存に失敗しました");
      }

      setDialogOpen(false);
      resetForm();
      fetchWorks();
    } catch (error) {
      console.error("作品の保存に失敗:", error);
      alert(error instanceof Error ? error.message : "作品の保存に失敗しました");
    }
  };

  const handleDelete = async () => {
    if (!workToDelete) return;

    try {
      const res = await fetch("/api/works", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: workToDelete }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "削除に失敗しました");
      }

      setDeleteDialogOpen(false);
      setWorkToDelete(null);
      fetchWorks();
    } catch (error) {
      console.error("作品の削除に失敗:", error);
      alert(error instanceof Error ? error.message : "作品の削除に失敗しました");
    }
  };

  const getCategoryLabel = (category: string) => {
    return categoryOptions.find((c) => c.value === category)?.label || category;
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography>読み込み中...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* 新規作成ボタン */}
      {canEdit && (
        <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
          >
            新規作成
          </Button>
        </Box>
      )}

      {/* 作品一覧テーブル */}
      <TableContainer component={Paper}>
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell>タイトル</TableCell>
              {!isMobile && <TableCell>カテゴリ</TableCell>}
              <TableCell>公開</TableCell>
              {canEdit && <TableCell align="center">操作</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {works.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  作品がありません
                </TableCell>
              </TableRow>
            ) : (
              works.map((work) => (
                <TableRow key={work.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {work.title}
                    </Typography>
                    {isMobile && (
                      <Typography variant="caption" color="text.secondary">
                        {getCategoryLabel(work.category)}
                      </Typography>
                    )}
                  </TableCell>
                  {!isMobile && (
                    <TableCell>
                      <Chip
                        label={getCategoryLabel(work.category)}
                        size="small"
                        color="info"
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <Chip
                      label={work.isPublished ? "公開" : "非公開"}
                      size="small"
                      color={work.isPublished ? "primary" : "default"}
                    />
                  </TableCell>
                  {canEdit && (
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => openEditDialog(work)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      {canDelete && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setWorkToDelete(work.id);
                            setDeleteDialogOpen(true);
                          }}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 作成/編集ダイアログ */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedWork ? "作品を編集" : "作品を追加"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
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
                {categoryOptions.map((option) => (
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
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDialogOpen(false)}>キャンセル</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!formTitle || !formDescription}
          >
            {selectedWork ? "更新" : "追加"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>作品を削除</DialogTitle>
        <DialogContent>
          <Typography>この作品を削除してもよろしいですか？</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>キャンセル</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GalleryManagement;
