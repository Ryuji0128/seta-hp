"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { Session } from "next-auth";
import { useState } from "react";
import DeleteConfirmDialog from "@/components/manage/DeleteConfirmDialog";
import ResourceTable, { type ResourceColumn } from "@/components/manage/ResourceTable";
import { useCrudResource } from "@/lib/hooks/useCrudResource";

interface Inquiry {
  id: number;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  inquiry: string;
}

interface InquiryManagementProps {
  session: Session;
}

const InquiryManagement: React.FC<InquiryManagementProps> = ({ session }) => {
  const { items: inquiries, loading, remove } = useCrudResource<Inquiry>({
    endpoint: "/api/email",
    listKey: "inquiries",
    label: "問い合わせ",
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState<number | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const userRole = session?.user?.role;
  const canDelete = userRole === "ADMIN";

  const handleDelete = async () => {
    if (!inquiryToDelete) return;
    const ok = await remove(inquiryToDelete);
    if (ok) {
      setDeleteDialogOpen(false);
      setInquiryToDelete(null);
    }
  };

  const columns: ResourceColumn<Inquiry>[] = [
    {
      header: "日付",
      align: "center",
      render: (inquiry) => dayjs(inquiry.createdAt).format("YYYY/MM/DD"),
    },
    {
      header: "時間",
      align: "center",
      hideOnMobile: true,
      render: (inquiry) => dayjs(inquiry.createdAt).format("HH:mm"),
    },
    {
      header: "氏名",
      align: "center",
      render: (inquiry) => (
        <Box sx={{ maxWidth: "140px", overflowX: "auto", whiteSpace: "nowrap" }}>
          {inquiry.name}
        </Box>
      ),
    },
    {
      header: "メールアドレス",
      align: "center",
      hideOnMobile: true,
      render: (inquiry) => (
        <Box sx={{ maxWidth: "220px", overflowX: "auto", whiteSpace: "nowrap" }}>
          {inquiry.email}
        </Box>
      ),
    },
    {
      header: "電話番号",
      align: "center",
      hideOnMobile: true,
      render: (inquiry) => inquiry.phone,
    },
  ];

  return (
    <Box>
      <ResourceTable
        items={inquiries}
        columns={columns}
        loading={loading}
        emptyMessage="問い合わせはありません"
        pageSize={10}
        actions={(inquiry) => (
          <>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSelectedInquiry(inquiry);
                setDetailDialogOpen(true);
              }}
              sx={{ m: "2px" }}
            >
              詳細
            </Button>
            {canDelete && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => {
                  setInquiryToDelete(inquiry.id);
                  setDeleteDialogOpen(true);
                }}
                sx={{ m: "2px" }}
              >
                削除
              </Button>
            )}
          </>
        )}
      />

      {/* 詳細ダイアログ */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>問い合わせ詳細</DialogTitle>
        <DialogContent>
          {selectedInquiry && (
            <>
              <Typography>
                <strong>日付:</strong> {dayjs(selectedInquiry.createdAt).format("YYYY/MM/DD HH:mm")}
              </Typography>
              <Typography>
                <strong>氏名:</strong> {selectedInquiry.name}
              </Typography>
              <Typography>
                <strong>メールアドレス:</strong> {selectedInquiry.email}
              </Typography>
              <Typography>
                <strong>電話番号:</strong> {selectedInquiry.phone}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                <strong>お問い合わせ内容:</strong>
              </Typography>
              <Typography sx={{ whiteSpace: "pre-wrap", maxHeight: "300px", overflowY: "auto" }}>
                {selectedInquiry.inquiry}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>閉じる</Button>
        </DialogActions>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        title="問い合わせを削除"
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default InquiryManagement;
