'use client';

import { Avatar, Box, Divider, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const ProfileConsoleModal = () => {
  const { data: session, status } = useSession();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isMenuOpen = Boolean(anchorEl);
  const router = useRouter();

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navigateTo = (path: string) => {
    router.push(path);
    handleMenuClose();
  };

  const menuItems = [
    { label: "お知らせ管理", path: "/news" },
    { label: "問い合わせ管理", path: "/contact" },
  ];

  return (
    <>
      {status === "authenticated" && (
        <>
          <IconButton onClick={handleMenuOpen} color="inherit">
            <Avatar src="/seta_logo.svg" alt={session?.user?.name ?? ""} sx={{ width: 32, height: 32 }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            PaperProps={{
              style: {
                marginTop: "10px",
                borderRadius: "10px",
                padding: "10px",
                minWidth: "250px",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", p: 2 }}>
              <Avatar
                src="/seta_logo.svg"
                sx={{ width: 48, height: 48, mb: 1 }}
                alt={session?.user?.name ?? ""}
              />
              <Typography variant="body1">{session?.user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {session?.user?.email}
              </Typography>
            </Box>
            <Box>
              {menuItems.map((item, index) => (
                <MenuItem key={index} onClick={() => navigateTo(item.path)}>
                  {item.label}
                </MenuItem>
              ))}
              <Divider sx={{ my: 1 }} />
              <MenuItem onClick={() => signOut()}>ログアウト</MenuItem>
              <MenuItem onClick={handleMenuClose}>プロフィールを閉じる</MenuItem>
            </Box>
          </Menu>
        </>
      )}
    </>
  );
};

export default ProfileConsoleModal;
