"use client";

import {
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { Session } from "next-auth";
import { useCallback } from "react";
import MultiImageUpload from "@/components/MultiImageUpload";
import DeleteConfirmDialog from "@/components/manage/DeleteConfirmDialog";
import ResourceActions from "@/components/manage/ResourceActions";
import FormDialog from "@/components/manage/FormDialog";
import ResourceTable, { type ResourceColumn } from "@/components/manage/ResourceTable";
import { useCrudResource } from "@/lib/hooks/useCrudResource";
import { useResourceDelete } from "@/lib/hooks/useResourceDelete";
import { useResourceEditor } from "@/lib/hooks/useResourceEditor";
import { getManagementPermissions } from "@/lib/management-permissions";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import {
  PRODUCT_CATEGORIES,
  STOCK_OPTIONS,
  getProductCategoryLabel,
  getStockMeta,
} from "@/lib/constants/categories";
import { parseProductImages, type Product } from "@/lib/types/product";

interface ProductManagementProps {
  session: Session;
}

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: string;
  tags: string;
  images: string[];
  stock: string;
  isPublished: boolean;
  isHeroImage: boolean;
  purchaseUrl: string;
}

const createProductForm = (): ProductForm => ({
  name: "",
  description: "",
  price: "",
  category: PRODUCT_CATEGORIES[0].value,
  tags: "",
  images: [],
  stock: STOCK_OPTIONS[0].value,
  isPublished: true,
  isHeroImage: false,
  purchaseUrl: "",
});

const editProductForm = (product: Product): ProductForm => ({
  name: product.name,
  description: product.description,
  price: product.price.toString(),
  category: product.category,
  tags: product.tags,
  images: parseProductImages(product.images),
  stock: product.stock,
  isPublished: product.isPublished,
  isHeroImage: product.isHeroImage,
  purchaseUrl: product.purchaseUrl || "",
});

const ProductManagement: React.FC<ProductManagementProps> = ({ session }) => {
  const { items: products, loading, save, remove, pagination } = useCrudResource<Product>({
    endpoint: "/api/products",
    listUrl: "/api/products?includeUnpublished=true",
    listKey: "products",
    label: "商品",
    pageSize: 50,
  });
  const isMobile = useIsMobile();

  const { canEdit, canDelete } = getManagementPermissions(session?.user?.role);
  const { deleteDialogOpen, requestDelete, cancelDelete, confirmDelete } =
    useResourceDelete(remove);

  const saveProduct = useCallback((form: ProductForm, id?: number) => save({
    name: form.name,
    description: form.description,
    price: Number(form.price),
    category: form.category,
    tags: form.tags,
    images: form.images.length > 0 ? form.images : null,
    stock: form.stock,
    isPublished: form.isPublished,
    isHeroImage: form.isHeroImage,
    purchaseUrl: form.purchaseUrl || null,
  }, id), [save]);
  const editor = useResourceEditor<Product, ProductForm>({
    createForm: createProductForm,
    editForm: editProductForm,
    save: saveProduct,
  });

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
        pagination={{
          page: pagination.page,
          totalPages: pagination.totalPages,
          onPageChange: pagination.setPage,
        }}
        onCreate={canEdit ? editor.openCreate : undefined}
        actions={
          canEdit
            ? (product) => (
                <ResourceActions
                  mode="icon"
                  primaryLabel="商品を編集"
                  onPrimary={() => editor.openEdit(product)}
                  onDelete={canDelete ? () => requestDelete(product.id) : undefined}
                />
              )
            : undefined
        }
      />

      {/* 作成/編集ダイアログ */}
      <FormDialog
        open={editor.dialogOpen}
        title={editor.selectedResource ? "商品を編集" : "商品を作成"}
        submitLabel={editor.selectedResource ? "更新" : "作成"}
        submitDisabled={!editor.form.name || !editor.form.description || !editor.form.price}
        onClose={editor.close}
        onSubmit={editor.submit}
      >
        <TextField
          label="商品名"
          value={editor.form.name}
          onChange={(e) => editor.setField("name", e.target.value)}
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
        <TextField
          label="価格（税込）"
          type="number"
          value={editor.form.price}
          onChange={(e) => editor.setField("price", e.target.value)}
          fullWidth
          required
          InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>¥</Typography> }}
        />
        <FormControl fullWidth>
          <InputLabel>カテゴリ</InputLabel>
          <Select
            value={editor.form.category}
            label="カテゴリ"
            onChange={(e) => editor.setField("category", e.target.value)}
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
          value={editor.form.tags}
          onChange={(e) => editor.setField("tags", e.target.value)}
          fullWidth
          placeholder="例: PLA, 実用品, セット"
        />
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            商品画像（最初の画像がメイン画像になります）
          </Typography>
          <MultiImageUpload
            value={editor.form.images}
            onChange={(images) => editor.setField("images", images)}
          />
        </Box>
        <FormControl fullWidth>
          <InputLabel>在庫状況</InputLabel>
          <Select
            value={editor.form.stock}
            label="在庫状況"
            onChange={(e) => editor.setField("stock", e.target.value)}
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
          value={editor.form.purchaseUrl}
          onChange={(e) => editor.setField("purchaseUrl", e.target.value)}
          fullWidth
          placeholder="https://example.thebase.in/items/..."
        />
        <FormControlLabel
          control={
            <Switch
              checked={editor.form.isPublished}
              onChange={(e) => editor.setField("isPublished", e.target.checked)}
            />
          }
          label="公開する"
        />
        <FormControlLabel
          control={
            <Switch
              checked={editor.form.isHeroImage}
              onChange={(e) => editor.setField("isHeroImage", e.target.checked)}
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
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />
    </Box>
  );
};

export default ProductManagement;
