"use client";

import {
  Chip,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Session } from "next-auth";
import { useState } from "react";
import MultiImageUpload from "@/components/MultiImageUpload";
import DeleteConfirmDialog from "@/components/manage/DeleteConfirmDialog";
import FormDialog from "@/components/manage/FormDialog";
import ResourceTable, { type ResourceColumn } from "@/components/manage/ResourceTable";
import { useCrudResource } from "@/lib/hooks/useCrudResource";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import {
  PRODUCT_CATEGORIES,
  STOCK_OPTIONS,
  getProductCategoryLabel,
  getStockMeta,
} from "@/lib/constants/categories";
import { type Product } from "@/lib/types/product";

interface ProductManagementProps {
  session: Session;
}

const ProductManagement: React.FC<ProductManagementProps> = ({ session }) => {
  const { items: products, loading, save, remove } = useCrudResource<Product>({
    endpoint: "/api/products",
    listUrl: "/api/products?includeUnpublished=true",
    listKey: "products",
    label: "商品",
  });
  const isMobile = useIsMobile();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  // フォーム用
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCategory, setFormCategory] = useState<string>(PRODUCT_CATEGORIES[0].value);
  const [formTags, setFormTags] = useState("");
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formStock, setFormStock] = useState<string>(STOCK_OPTIONS[0].value);
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [formIsHeroImage, setFormIsHeroImage] = useState(false);
  const [formPurchaseUrl, setFormPurchaseUrl] = useState("");

  const userRole = session?.user?.role;
  const canEdit = userRole === "ADMIN" || userRole === "EDITOR";
  const canDelete = userRole === "ADMIN";

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormPrice("");
    setFormCategory(PRODUCT_CATEGORIES[0].value);
    setFormTags("");
    setFormImages([]);
    setFormStock(STOCK_OPTIONS[0].value);
    setFormIsPublished(true);
    setFormIsHeroImage(false);
    setFormPurchaseUrl("");
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
    // 後方互換性: imagesがあればそれを使い、なければimageから配列を作成
    const existingImages = Array.isArray(product.images)
      ? (product.images as string[])
      : product.image
        ? [product.image]
        : [];
    setFormImages(existingImages);
    setFormStock(product.stock);
    setFormIsPublished(product.isPublished);
    setFormIsHeroImage(product.isHeroImage);
    setFormPurchaseUrl(product.purchaseUrl || "");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      name: formName,
      description: formDescription,
      price: Number(formPrice),
      category: formCategory,
      tags: formTags,
      image: formImages[0] || null, // 最初の画像をメイン画像として保存（後方互換性）
      images: formImages.length > 0 ? formImages : null,
      stock: formStock,
      isPublished: formIsPublished,
      isHeroImage: formIsHeroImage,
      purchaseUrl: formPurchaseUrl || null,
    };

    const ok = await save(payload, selectedProduct?.id);
    if (ok) {
      setDialogOpen(false);
      resetForm();
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    const ok = await remove(productToDelete);
    if (ok) {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const columns: ResourceColumn<Product>[] = [
    {
      header: "商品名",
      render: (product) => (
        <>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {product.name}
          </Typography>
          {isMobile && (
            <Typography variant="caption" color="text.secondary">
              {getProductCategoryLabel(product.category)}
            </Typography>
          )}
        </>
      ),
    },
    {
      header: "カテゴリ",
      hideOnMobile: true,
      render: (product) => (
        <Chip
          label={getProductCategoryLabel(product.category)}
          size="small"
          color={product.category === "3d-print" ? "success" : "warning"}
        />
      ),
    },
    {
      header: "価格",
      align: "right",
      render: (product) => `¥${product.price.toLocaleString()}`,
    },
    {
      header: "在庫",
      render: (product) => (
        <Chip
          label={product.stock}
          size="small"
          color={getStockMeta(product.stock)?.muiColor ?? "info"}
        />
      ),
    },
    {
      header: "公開",
      render: (product) => (
        <Chip
          label={product.isPublished ? "公開" : "非公開"}
          size="small"
          color={product.isPublished ? "primary" : "default"}
        />
      ),
    },
  ];

  return (
    <Box>
      <ResourceTable
        items={products}
        columns={columns}
        loading={loading}
        emptyMessage="商品がありません"
        onCreate={canEdit ? openCreateDialog : undefined}
        actions={
          canEdit
            ? (product) => (
                <>
                  <IconButton size="small" onClick={() => openEditDialog(product)} color="primary">
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
                </>
              )
            : undefined
        }
      />

      {/* 作成/編集ダイアログ */}
      <FormDialog
        open={dialogOpen}
        title={selectedProduct ? "商品を編集" : "商品を作成"}
        submitLabel={selectedProduct ? "更新" : "作成"}
        submitDisabled={!formName || !formDescription || !formPrice}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSave}
      >
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
            {PRODUCT_CATEGORIES.map((option) => (
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
            商品画像（最初の画像がメイン画像になります）
          </Typography>
          <MultiImageUpload value={formImages} onChange={setFormImages} maxImages={10} />
        </Box>
        <FormControl fullWidth>
          <InputLabel>在庫状況</InputLabel>
          <Select
            value={formStock}
            label="在庫状況"
            onChange={(e) => setFormStock(e.target.value)}
          >
            {STOCK_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="購入URL（BASE等の外部ショップURL）"
          value={formPurchaseUrl}
          onChange={(e) => setFormPurchaseUrl(e.target.value)}
          fullWidth
          placeholder="https://example.thebase.in/items/..."
        />
        <FormControlLabel
          control={
            <Switch
              checked={formIsPublished}
              onChange={(e) => setFormIsPublished(e.target.checked)}
            />
          }
          label="公開する"
        />
        <FormControlLabel
          control={
            <Switch
              checked={formIsHeroImage}
              onChange={(e) => setFormIsHeroImage(e.target.checked)}
            />
          }
          label="TOPヒーロー画像に使用"
        />
      </FormDialog>

      {/* 削除確認ダイアログ */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        title="商品を削除"
        message="この商品を削除してもよろしいですか？"
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default ProductManagement;
