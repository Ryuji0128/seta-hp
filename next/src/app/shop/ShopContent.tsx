"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Tab,
  Tabs,
  Typography,
  CircularProgress,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import EmailIcon from "@mui/icons-material/Email";
import Image from "next/image";
import Link from "next/link";

type ProductCategory = "3dprint" | "lasercut";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string;
  image: string | null;
  stock: string;
}

const categoryInfo: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  "3dprint": {
    label: "3Dプリント",
    icon: <PrintIcon />,
    color: "#388e3c",
  },
  lasercut: {
    label: "レーザーカット",
    icon: <ContentCutIcon />,
    color: "#f57c00",
  },
};

export default function ShopContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<"all" | ProductCategory>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("商品の取得に失敗:", error);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts =
    category === "all" ? products : products.filter((p) => p.category === category);

  const getStockColor = (stock: string) => {
    switch (stock) {
      case "在庫あり":
        return "success";
      case "残りわずか":
        return "warning";
      case "売り切れ":
        return "error";
      case "受注生産":
        return "info";
      default:
        return "default";
    }
  };

  const getTagsArray = (tags: string) => {
    return tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
  };

  if (initialLoading) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>読み込み中...</Typography>
      </Box>
    );
  }

  return (
    <>
      {/* カテゴリタブ */}
      <Box sx={{ mb: 4 }}>
        <Tabs
          value={category}
          onChange={(_, value) => setCategory(value)}
          centered
          sx={{
            "& .MuiTab-root": {
              minWidth: 120,
            },
          }}
        >
          <Tab value="all" label="すべて" />
          <Tab
            value="3dprint"
            label="3Dプリント"
            icon={<PrintIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
          />
          <Tab
            value="lasercut"
            label="レーザーカット"
            icon={<ContentCutIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* 商品一覧 */}
      {filteredProducts.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography color="text.secondary">商品がありません</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => {
            const catInfo = categoryInfo[product.category] || {
              label: product.category,
              icon: <PrintIcon />,
              color: "#666",
            };
            const tags = getTagsArray(product.tags);

            return (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    },
                  }}
                  elevation={2}
                >
                  {/* 画像エリア */}
                  <Box
                    sx={{
                      height: 180,
                      bgcolor: "grey.100",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderBottom: "1px solid",
                      borderColor: "grey.200",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <Box sx={{ color: catInfo.color, textAlign: "center" }}>
                        {catInfo.icon}
                        <Typography variant="caption" display="block" color="grey.500">
                          No Image
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    {/* カテゴリ＆在庫 */}
                    <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                      <Chip
                        label={catInfo.label}
                        size="small"
                        sx={{
                          bgcolor: `${catInfo.color}15`,
                          color: catInfo.color,
                          fontSize: "0.7rem",
                        }}
                      />
                      <Chip
                        label={product.stock}
                        size="small"
                        color={getStockColor(product.stock)}
                        sx={{ fontSize: "0.7rem" }}
                      />
                    </Box>

                    {/* 商品名 */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      {product.name}
                    </Typography>

                    {/* 説明 */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        flexGrow: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {product.description}
                    </Typography>

                    {/* タグ */}
                    {tags.length > 0 && (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
                        {tags.map((tag, idx) => (
                          <Chip
                            key={idx}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "0.7rem" }}
                          />
                        ))}
                      </Box>
                    )}

                    {/* 価格 */}
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "primary.main", mb: 2 }}
                    >
                      ¥{product.price.toLocaleString()}
                      <Typography component="span" variant="body2" color="text.secondary">
                        （税込）
                      </Typography>
                    </Typography>

                    {/* 購入ボタン */}
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<EmailIcon />}
                      onClick={() => setSelectedProduct(product)}
                      disabled={product.stock === "売り切れ"}
                    >
                      {product.stock === "売り切れ" ? "売り切れ" : "購入のお問い合わせ"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* 購入確認ダイアログ */}
      <Dialog
        open={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedProduct && (
          <>
            <DialogTitle>購入について</DialogTitle>
            <DialogContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                {selectedProduct.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedProduct.description}
              </Typography>
              <Box
                sx={{
                  bgcolor: "grey.50",
                  p: 2,
                  borderRadius: 1,
                  textAlign: "center",
                  mb: 3,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  販売価格
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "primary.main" }}>
                  ¥{selectedProduct.price.toLocaleString()}
                  <Typography component="span" variant="body2" color="text.secondary">
                    （税込）
                  </Typography>
                </Typography>
              </Box>

              <Box sx={{ bgcolor: "primary.50", p: 2, borderRadius: 1, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  ご購入の流れ
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  1. お問い合わせフォームから商品名をご連絡ください<br />
                  2. 在庫確認後、振込先情報をメールでお送りします<br />
                  3. お振込確認後、商品を発送いたします
                </Typography>
              </Box>

              {selectedProduct.stock === "受注生産" && (
                <Typography variant="caption" color="warning.main" sx={{ display: "block" }}>
                  ※受注生産のため、発送までお時間をいただく場合があります。
                </Typography>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button onClick={() => setSelectedProduct(null)}>
                閉じる
              </Button>
              <Link href={`/contact?product=${encodeURIComponent(selectedProduct.name)}`} passHref>
                <Button
                  variant="contained"
                  startIcon={<EmailIcon />}
                >
                  お問い合わせフォームへ
                </Button>
              </Link>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
