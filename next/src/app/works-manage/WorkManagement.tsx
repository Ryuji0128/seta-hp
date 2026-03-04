"use client";

import { useState, useEffect, useCallback } from "react";
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
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import PrintIcon from "@mui/icons-material/Print";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import BuildIcon from "@mui/icons-material/Build";
import { Session } from "next-auth";
import ImageUpload from "@/components/ImageUpload";

type WorkCategory = "modeling" | "print" | "laser" | "mockup";

interface Work {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string;
  image: string | null;
  isPublished: boolean;
}

const categoryOptions: { value: WorkCategory; label: string; icon: React.ReactNode }[] = [
  { value: "modeling", label: "3Dモデリング", icon: <ViewInArIcon /> },
  { value: "print", label: "3Dプリント", icon: <PrintIcon /> },
  { value: "laser", label: "レーザーカット", icon: <ContentCutIcon /> },
  { value: "mockup", label: "モックアップ", icon: <BuildIcon /> },
];

const categoryInfo: Record<string, { label: string; color: string }> = {
  modeling: { label: "3Dモデリング", color: "#1976d2" },
  print: { label: "3Dプリント", color: "#388e3c" },
  laser: { label: "レーザーカット", color: "#f57c00" },
  mockup: { label: "モックアップ", color: "#7b1fa2" },
};

interface Props {
  session: Session;
}

export default function WorkManagement({ session }: Props) {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "modeling" as WorkCategory,
    tags: "",
    image: "",
    isPublished: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const userRole = (session?.user as { role?: string })?.role;
  const canEdit = userRole === "ADMIN" || userRole === "EDITOR";
  const canDelete = userRole === "ADMIN";

  const fetchWorks = useCallback(async () => {
    try {
      const res = await fetch("/api/works?includeUnpublished=true");
      const data = await res.json();
      setWorks(data.works || []);
    } catch (error) {
      console.error("制作事例の取得に失敗:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  const handleOpenDialog = (work?: Work) => {
    if (work) {
      setSelectedWork(work);
      setFormData({
        title: work.title,
        description: work.description,
        category: work.category as WorkCategory,
        tags: work.tags,
        image: work.image || "",
        isPublished: work.isPublished,
      });
    } else {
      setSelectedWork(null);
      setFormData({
        title: "",
        description: "",
        category: "modeling",
        tags: "",
        image: "",
        isPublished: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedWork(null);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const method = selectedWork ? "PUT" : "POST";
      const body = selectedWork
        ? { id: selectedWork.id, ...formData }
        : formData;

      const res = await fetch("/api/works", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchWorks();
        handleCloseDialog();
      } else {
        const data = await res.json();
        alert(data.error || "エラーが発生しました");
      }
    } catch {
      alert("通信エラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedWork) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/works", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedWork.id }),
      });

      if (res.ok) {
        fetchWorks();
        setDeleteDialogOpen(false);
        setSelectedWork(null);
      } else {
        const data = await res.json();
        alert(data.error || "エラーが発生しました");
      }
    } catch {
      alert("通信エラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {canEdit && (
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            新規作成
          </Button>
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>タイトル</TableCell>
              <TableCell>カテゴリ</TableCell>
              <TableCell>タグ</TableCell>
              <TableCell>公開</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {works.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary">制作事例がありません</Typography>
                </TableCell>
              </TableRow>
            ) : (
              works.map((work) => {
                const catInfo = categoryInfo[work.category] || {
                  label: work.category,
                  color: "#666",
                };
                return (
                  <TableRow key={work.id}>
                    <TableCell>{work.id}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {work.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={catInfo.label}
                        size="small"
                        sx={{
                          bgcolor: `${catInfo.color}15`,
                          color: catInfo.color,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {work.tags}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={work.isPublished ? "公開" : "非公開"}
                        size="small"
                        color={work.isPublished ? "success" : "default"}
                      />
                    </TableCell>
                    <TableCell>
                      {canEdit && (
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(work)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      {canDelete && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setSelectedWork(work);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 作成・編集ダイアログ */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedWork ? "制作事例を編集" : "制作事例を新規作成"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="タイトル"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="説明"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={4}
              required
            />
            <FormControl fullWidth>
              <InputLabel>カテゴリ</InputLabel>
              <Select
                value={formData.category}
                label="カテゴリ"
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as WorkCategory })
                }
              >
                {categoryOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {opt.icon}
                      {opt.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="タグ（カンマ区切り）"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              fullWidth
              placeholder="例: Fusion 360, FDM, ABS"
            />
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                画像
              </Typography>
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                disabled={submitting}
              />
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isPublished}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublished: e.target.checked })
                  }
                />
              }
              label="公開する"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={submitting}>
            キャンセル
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting || !formData.title || !formData.description}
          >
            {submitting ? "処理中..." : selectedWork ? "更新" : "作成"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>制作事例を削除</DialogTitle>
        <DialogContent>
          <Typography>
            「{selectedWork?.title}」を削除しますか？この操作は取り消せません。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={submitting}>
            キャンセル
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={submitting}
          >
            {submitting ? "削除中..." : "削除"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
