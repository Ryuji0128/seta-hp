"use client";

import {
  Box,
  Button,
  Modal,
  Paper,
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
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";

interface News {
  id: number;
  createdAt: string;
  updatedAt: string;
  date: string;
  title: string;
  contents: { text: string };
  url: string | null;
}

interface NewsManagementProps {
  session: Session;
}

const NewsManagement: React.FC<NewsManagementProps> = ({ session }) => {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  // フォーム用
  const [formTitle, setFormTitle] = useState("");
  const [formContents, setFormContents] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formUrl, setFormUrl] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(`(max-width:${theme.breakpoints.values.sm}px)`);

  const userRole = (session?.user as { role?: string })?.role;

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(newsList.length / ITEMS_PER_PAGE);
  const paginatedData = newsList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const fetchNews = useCallback(async () => {
    try {
      const response = await axios.get<{ news: News[] }>("/api/news");
      setNewsList(response.data.news);
    } catch (error) {
      console.error("お知らせ一覧の取得に失敗:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const deleteNews = async () => {
    if (!newsToDelete) return;

    try {
      await axios.delete("/api/news", {
        data: { id: newsToDelete },
      });
      setDeleteModalOpen(false);
      fetchNews();
    } catch (error) {
      console.error("お知らせの削除に失敗:", error);
    }
  };

  const createNews = async () => {
    try {
      await axios.post("/api/news", {
        title: formTitle,
        contents: { text: formContents },
        date: formDate,
        url: formUrl || null,
      });
      setCreateModalOpen(false);
      resetForm();
      fetchNews();
    } catch (error) {
      console.error("お知らせの作成に失敗:", error);
    }
  };

  const updateNews = async () => {
    if (!selectedNews) return;

    try {
      await axios.put("/api/news", {
        id: selectedNews.id,
        title: formTitle,
        contents: { text: formContents },
        date: formDate,
        url: formUrl || null,
      });
      setEditModalOpen(false);
      resetForm();
      fetchNews();
    } catch (error) {
      console.error("お知らせの更新に失敗:", error);
    }
  };

  const resetForm = () => {
    setFormTitle("");
    setFormContents("");
    setFormDate("");
    setFormUrl("");
    setSelectedNews(null);
  };

  const openEditModal = (news: News) => {
    setSelectedNews(news);
    setFormTitle(news.title);
    setFormContents(news.contents?.text || "");
    setFormDate(dayjs(news.date).format("YYYY-MM-DD"));
    setFormUrl(news.url || "");
    setEditModalOpen(true);
  };

  const openCreateModal = () => {
    resetForm();
    setFormDate(dayjs().format("YYYY-MM-DD"));
    setCreateModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Box sx={{ maxWidth: "1000px", margin: "0 auto", padding: 2 }}>
      {/* 新規作成ボタン */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" onClick={openCreateModal}>
          新規作成
        </Button>
      </Box>

      {/* ページネーション */}
      <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
        <Button
          variant="outlined"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          前へ
        </Button>
        <Typography sx={{ fontSize: { xs: "12px", md: "14px" }, alignSelf: "center" }}>
          {currentPage} / {totalPages || 1}
        </Typography>
        <Button
          variant="outlined"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          次へ
        </Button>
      </Box>

      {loading ? (
        <Typography>読み込み中...</Typography>
      ) : newsList.length === 0 ? (
        <Typography>お知らせはありません。</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ maxHeight: "600px" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", width: "120px", textAlign: "center" }}>
                  日付
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                  タイトル
                </TableCell>
                {!isMobile && (
                  <TableCell sx={{ fontWeight: "bold", width: "200px", textAlign: "center" }}>
                    内容
                  </TableCell>
                )}
                <TableCell sx={{ fontWeight: "bold", width: "160px", textAlign: "center" }}>
                  操作
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((news) => (
                <TableRow key={news.id}>
                  <TableCell sx={{ textAlign: "center" }}>
                    {dayjs(news.date).format("YYYY/MM/DD")}
                  </TableCell>
                  <TableCell sx={{ textAlign: "left" }}>
                    {news.title}
                  </TableCell>
                  {!isMobile && (
                    <TableCell
                      sx={{
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {news.contents?.text || ""}
                    </TableCell>
                  )}
                  <TableCell sx={{ textAlign: "center" }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => openEditModal(news)}
                      sx={{ m: "2px" }}
                    >
                      編集
                    </Button>
                    {userRole === "ADMIN" && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => {
                          setNewsToDelete(news.id);
                          setDeleteModalOpen(true);
                        }}
                        sx={{ m: "2px" }}
                      >
                        削除
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box sx={{ marginBottom: "100px" }} />

      {/* 新規作成モーダル */}
      <Modal open={createModalOpen} onClose={() => setCreateModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "500px",
            backgroundColor: "white",
            padding: 3,
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            お知らせ新規作成
          </Typography>
          <TextField
            label="日付"
            type="date"
            value={formDate}
            onChange={(e) => setFormDate(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="タイトル"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="内容"
            value={formContents}
            onChange={(e) => setFormContents(e.target.value)}
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
          <TextField
            label="リンクURL（任意）"
            value={formUrl}
            onChange={(e) => setFormUrl(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button onClick={() => setCreateModalOpen(false)}>キャンセル</Button>
            <Button variant="contained" onClick={createNews}>
              作成
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* 編集モーダル */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "500px",
            backgroundColor: "white",
            padding: 3,
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            お知らせ編集
          </Typography>
          <TextField
            label="日付"
            type="date"
            value={formDate}
            onChange={(e) => setFormDate(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="タイトル"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="内容"
            value={formContents}
            onChange={(e) => setFormContents(e.target.value)}
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
          <TextField
            label="リンクURL（任意）"
            value={formUrl}
            onChange={(e) => setFormUrl(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button onClick={() => setEditModalOpen(false)}>キャンセル</Button>
            <Button variant="contained" onClick={updateNews}>
              更新
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* 削除確認モーダル */}
      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "300px",
            backgroundColor: "white",
            padding: 3,
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <Typography>本当に削除してよろしいですか？</Typography>
          <Box sx={{ mt: 2, display: "flex", gap: 2, justifyContent: "center" }}>
            <Button onClick={() => setDeleteModalOpen(false)}>キャンセル</Button>
            <Button color="error" variant="contained" onClick={deleteNews}>
              削除
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default NewsManagement;
