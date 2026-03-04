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

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string;
  image: string | null;
  stock: string;
  isPublished: boolean;
  createdAt: string;
}

interface ProductManagementProps {
  session: Session;
}

const stockOptions = ["在庫あり", "残りわずか", "受注生産", "売り切れ"];
const categoryOptions = [
  { value: "3dprint", label: "3Dプリント" },
  { value: "lasercut", label: "レーザーカット" },
];

const ProductManagement: React.FC<ProductManagementProps> = ({ session }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  // フォーム用
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCategory, setFormCategory] = useState("3dprint");
  const [formTags, setFormTags] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formStock, setFormStock] = useState("在庫あり");
  const [formIsPublished, setFormIsPublished] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(`(max-width:${theme.breakpoints.values.sm}px)`);

  const userRole = (session?.user as { role?: string })?.role;
  const canEdit = userRole === "ADMIN" || userRole === "EDITOR";
  const canDelete = userRole === "ADMIN";

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products?includeUnpublished=true");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("商品一覧の取得に失敗:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormPrice("");
    setFormCategory("3dprint");
    setFormTags("");
    setFormImage("");
    setFormStock("在庫あり");
    setFormIsPublished(true);
    setSelectedProduct(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormName(product.name);
    setFormDescription(product.description);
    setFormPrice(product.price.toString());
    setFormCategory(product.category);
    setFormTags(product.tags);
    setFormImage(product.image || "");
    setFormStock(product.stock);
    setFormIsPublished(product.isPublished);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const data = {
        name: formName,
        description: formDescription,
        price: Number(formPrice),
        category: formCategory,
        tags: formTags,
        image: formImage || null,
        stock: formStock,
        isPublished: formIsPublished,
      };

      const method = selectedProduct ? "PUT" : "POST";
      const body = selectedProduct
        ? { id: selectedProduct.id, ...data }
        : data;

      const res = await fetch("/api/products", {
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
      fetchProducts();
    } catch (error) {
      console.error("商品の保存に失敗:", error);
      alert(error instanceof Error ? error.message : "商品の保存に失敗しました");
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productToDelete }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "削除に失敗しました");
      }

      setDeleteDialogOpen(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (error) {
      console.error("商品の削除に失敗:", error);
      alert(error instanceof Error ? error.message : "商品の削除に失敗しました");
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

      {/* 商品一覧テーブル */}
      <TableContainer component={Paper}>
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell>商品名</TableCell>
              {!isMobile && <TableCell>カテゴリ</TableCell>}
              <TableCell align="right">価格</TableCell>
              <TableCell>在庫</TableCell>
              <TableCell>公開</TableCell>
              {canEdit && <TableCell align="center">操作</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  商品がありません
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {product.name}
                    </Typography>
                    {isMobile && (
                      <Typography variant="caption" color="text.secondary">
                        {getCategoryLabel(product.category)}
                      </Typography>
                    )}
                  </TableCell>
                  {!isMobile && (
                    <TableCell>
                      <Chip
                        label={getCategoryLabel(product.category)}
                        size="small"
                        color={product.category === "3dprint" ? "success" : "warning"}
                      />
                    </TableCell>
                  )}
                  <TableCell align="right">
                    ¥{product.price.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.stock}
                      size="small"
                      color={
                        product.stock === "在庫あり"
                          ? "success"
                          : product.stock === "残りわずか"
                            ? "warning"
                            : product.stock === "売り切れ"
                              ? "error"
                              : "info"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.isPublished ? "公開" : "非公開"}
                      size="small"
                      color={product.isPublished ? "primary" : "default"}
                    />
                  </TableCell>
                  {canEdit && (
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => openEditDialog(product)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      {canDelete && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setProductToDelete(product.id);
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
        <DialogTitle>{selectedProduct ? "商品を編集" : "商品を作成"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="商品名"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
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
            <TextField
              label="価格（税込）"
              type="number"
              value={formPrice}
              onChange={(e) => setFormPrice(e.target.value)}
              fullWidth
              required
              InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>¥</Typography> }}
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
              placeholder="例: PLA, 実用品, セット"
            />
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                商品画像
              </Typography>
              <ImageUpload value={formImage} onChange={setFormImage} />
            </Box>
            <FormControl fullWidth>
              <InputLabel>在庫状況</InputLabel>
              <Select
                value={formStock}
                label="在庫状況"
                onChange={(e) => setFormStock(e.target.value)}
              >
                {stockOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            disabled={!formName || !formDescription || !formPrice}
          >
            {selectedProduct ? "更新" : "作成"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>商品を削除</DialogTitle>
        <DialogContent>
          <Typography>この商品を削除してもよろしいですか？</Typography>
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

export default ProductManagement;
