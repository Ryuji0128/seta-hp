"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Link as MuiLink,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import RefreshIcon from "@mui/icons-material/Refresh";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/ja";

interface Estimate {
  id: number;
  createdAt: string;
  fileName: string;
  filePath: string;
  amount: number;
  status: string;
}

interface Props {
  session: Session;
}

const EstimateManagement = ({ session }: Props) => {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userRole = (session?.user as { role?: string })?.role;

  const fetchEstimates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<{ estimates: Estimate[] }>("/api/estimates");
      setEstimates(response.data.estimates);
    } catch (err) {
      console.error("見積書取得エラー:", err);
      setError("見積書の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstimates();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("この見積書を削除しますか？")) return;

    try {
      await axios.delete("/api/estimates", { data: { id } });
      setEstimates((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("削除エラー:", err);
      alert("削除に失敗しました");
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case "pending":
        return <Chip label="未処理" size="small" color="warning" />;
      case "paid":
        return <Chip label="支払済" size="small" color="success" />;
      case "cancelled":
        return <Chip label="キャンセル" size="small" color="error" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error">{error}</Typography>
          <Button onClick={fetchEstimates} sx={{ mt: 2 }}>
            再読み込み
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DescriptionIcon sx={{ color: "primary.main" }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              見積書一覧
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchEstimates}
            size="small"
          >
            更新
          </Button>
        </Box>

        {estimates.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
            見積書はまだありません
          </Typography>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50" }}>
                  <TableCell>ID</TableCell>
                  <TableCell>日時</TableCell>
                  <TableCell>ファイル名</TableCell>
                  <TableCell align="right">金額</TableCell>
                  <TableCell>ステータス</TableCell>
                  <TableCell align="center">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {estimates.map((estimate) => (
                  <TableRow key={estimate.id} hover>
                    <TableCell>{estimate.id}</TableCell>
                    <TableCell>
                      {dayjs(estimate.createdAt).format("YYYY/MM/DD HH:mm")}
                    </TableCell>
                    <TableCell>
                      {estimate.filePath ? (
                        <MuiLink
                          href={estimate.filePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                        >
                          {estimate.fileName}
                          <OpenInNewIcon sx={{ fontSize: 14 }} />
                        </MuiLink>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {estimate.fileName}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      ¥{estimate.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusChip(estimate.status)}</TableCell>
                    <TableCell align="center">
                      {userRole === "ADMIN" && (
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDelete(estimate.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default EstimateManagement;
