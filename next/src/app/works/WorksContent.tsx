"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Tab,
  Tabs,
  Typography,
  CircularProgress,
} from "@mui/material";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import PrintIcon from "@mui/icons-material/Print";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import BuildIcon from "@mui/icons-material/Build";
import Image from "next/image";

type WorkCategory = "modeling" | "print" | "laser" | "mockup";

interface Work {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string;
  image: string | null;
}

const categoryInfo: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  modeling: {
    label: "3Dモデリング",
    icon: <ViewInArIcon sx={{ fontSize: 20 }} />,
    color: "#1976d2",
  },
  print: {
    label: "3Dプリント",
    icon: <PrintIcon sx={{ fontSize: 20 }} />,
    color: "#388e3c",
  },
  laser: {
    label: "レーザーカット",
    icon: <ContentCutIcon sx={{ fontSize: 20 }} />,
    color: "#f57c00",
  },
  mockup: {
    label: "モックアップ",
    icon: <BuildIcon sx={{ fontSize: 20 }} />,
    color: "#7b1fa2",
  },
};

export default function WorksContent() {
  const [works, setWorks] = useState<Work[]>([]);
  const [category, setCategory] = useState<"all" | WorkCategory>("all");
  const [loading, setLoading] = useState(true);

  const fetchWorks = useCallback(async () => {
    try {
      const res = await fetch("/api/works");
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

  const filteredWorks =
    category === "all" ? works : works.filter((w) => w.category === category);

  const getTagsArray = (tags: string) => {
    return tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
  };

  if (loading) {
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
              minWidth: 100,
            },
          }}
        >
          <Tab value="all" label="すべて" />
          <Tab
            value="modeling"
            label="3Dモデリング"
            icon={<ViewInArIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
          />
          <Tab
            value="print"
            label="3Dプリント"
            icon={<PrintIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
          />
          <Tab
            value="laser"
            label="レーザーカット"
            icon={<ContentCutIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
          />
          <Tab
            value="mockup"
            label="モックアップ"
            icon={<BuildIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* 制作事例一覧 */}
      {filteredWorks.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography color="text.secondary">制作事例がありません</Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredWorks.map((work) => {
            const catInfo = categoryInfo[work.category] || {
              label: work.category,
              icon: <ViewInArIcon sx={{ fontSize: 20 }} />,
              color: "#666",
            };
            const tags = getTagsArray(work.tags);

            return (
              <Grid item xs={12} md={6} key={work.id}>
                <Card
                  sx={{
                    height: "100%",
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
                      height: 200,
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
                    {work.image ? (
                      <Image
                        src={work.image}
                        alt={work.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <Box sx={{ color: "grey.400", textAlign: "center" }}>
                        <Box sx={{ color: catInfo.color, mb: 1 }}>
                          {catInfo.icon}
                        </Box>
                        <Typography variant="caption" color="grey.500">
                          No Image
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    {/* カテゴリラベル */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <Chip
                        icon={catInfo.icon as React.ReactElement}
                        label={catInfo.label}
                        size="small"
                        sx={{
                          bgcolor: `${catInfo.color}15`,
                          color: catInfo.color,
                          fontWeight: 500,
                          "& .MuiChip-icon": { color: catInfo.color },
                        }}
                      />
                    </Box>

                    {/* タイトル */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {work.title}
                    </Typography>

                    {/* 説明 */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
                      {work.description}
                    </Typography>

                    {/* タグ */}
                    {tags.length > 0 && (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {tags.map((tag, idx) => (
                          <Chip
                            key={idx}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "0.75rem" }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </>
  );
}
