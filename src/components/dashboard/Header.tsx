"use client";
import * as React from "react";
import { useColorScheme } from "@mui/joy/styles";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import Stack from "@mui/joy/Stack";
import Avatar from "@mui/joy/Avatar";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Tooltip from "@mui/joy/Tooltip";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import ListDivider from "@mui/joy/ListDivider";
import Drawer from "@mui/joy/Drawer";
import ModalClose from "@mui/joy/ModalClose";
import DialogTitle from "@mui/joy/DialogTitle";

import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import BookRoundedIcon from "@mui/icons-material/BookRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

import Navigation from "./Navigation";

import axios from "axios";
import { useCookies } from "next-client-cookies";
import { APP_ROUTES } from "../Route";
import { useRouter } from "next/navigation";
import { responsiveFontSizes } from "@mui/material";

export default function Header(props) {
  const cookies = useCookies();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState({});

  React.useEffect(() => {
    const getUserInfo = async () => {
      try {
        const { data } = await axios.get(APP_ROUTES.URL + "/auth/profile", {
          headers: {
            Authorization: `Bearer ${cookies.get("access_token")}`,
          },
        });
        setUserInfo(data);
      } catch (error) {
        router.push("/");
        cookies.remove("access_token");
      }
    };

    getUserInfo();
  }, [cookies, router]);

  return (
    <Box
      sx={{
        display: "flex",
        flexGrow: 1,
        justifyContent: "space-between",
      }}
    >
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
        sx={{ display: { xs: "none", sm: "flex", cursor: "pointer" } }}
        onClick={() => router.push("/dashboard")}
      >
        <SchoolRoundedIcon
          fontSize="large"
          sx={{ width: 30, height: 30, color: "#4C6A55" }}
        />
        <Typography
          component="h1"
          level="title-md"
          textColor="text.primary"
          sx={{ fontSize: 20, color: "#4C6A55" }}
        >
          Pro-Skill Academy
        </Typography>
      </Stack>
      <Box sx={{ display: { xs: "inline-flex", sm: "none" } }}>
        <IconButton
          variant="plain"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <MenuRoundedIcon />
        </IconButton>
        <Drawer
          sx={{ display: { xs: "inline-flex", sm: "none" } }}
          open={open}
          onClose={() => setOpen(false)}
        >
          <ModalClose />
          <DialogTitle
            sx={{ fontSize: 18, color: "#4C6A55", cursor: "pointer" }}
            onClick={() => router.push("/dashboard")}
          >
            Pro-Skill Academy
          </DialogTitle>
          <Box sx={{ px: 1 }}>
            <Navigation />
          </Box>
        </Drawer>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => router.push("/dashboard")}
      >
        <Typography
          component="h1"
          level="title-md"
          textColor="text.primary"
          sx={{
            display: { xs: "flex", sm: "none" },
            fontSize: 20,
            cursor: "pointer",
            color: "#4C6A55",
          }}
        >
          Pro-Skill Academy
        </Typography>
      </Box>
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          flexDirection: "row",
          gap: "5px",
          alignItems: "center",
          mr: "20px",
          fontWeight: "bold",
        }}
      >
        <span style={{ fontWeight: "normal" }}>Баллы:</span>
        {props?.profile?.balls}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1.5,
          alignItems: "center",
        }}
      >
        <Dropdown>
          <MenuButton
            variant="plain"
            size="sm"
            sx={{
              maxWidth: "32px",
              maxHeight: "32px",
              borderRadius: "9999999px",
            }}
          >
            <Avatar
              src="https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
              srcSet="https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
              sx={{ maxWidth: "32px", maxHeight: "32px" }}
            />
          </MenuButton>
          <Menu
            placement="bottom-end"
            size="sm"
            sx={{
              zIndex: "99999",
              p: 1,
              gap: 1,
              "--ListItem-radius": "var(--joy-radius-sm)",
            }}
          >
            <MenuItem>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Avatar
                  src="https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
                  srcSet="https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
                  sx={{ borderRadius: "50%" }}
                />
                <Box sx={{ ml: 1.5 }}>
                  <Typography level="title-sm" textColor="text.primary">
                    {props.profile.fullName}
                  </Typography>
                  <Typography level="body-xs" textColor="text.tertiary">
                    {props.profile.email}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            <ListDivider />
            <Typography
              level="body-xs"
              textColor="text.tertiary"
              sx={{
                fontSize: "14px",
                width: "100%",
                textAlign: "left",
                paddingLeft: "10px",
              }}
            >
              Вам доступно {props.profile.balls} балла
            </Typography>
            <a href="https://t.me/ProskillAcademyHelp" title="profile">
              <MenuItem>
                <HelpRoundedIcon />
                Помощь
              </MenuItem>
            </a>
            <a href="/profile" title="profile">
              <MenuItem>
                <SettingsRoundedIcon />
                Настройки
              </MenuItem>
            </a>
            <ListDivider />
            <MenuItem
              onClick={() => {
                cookies.remove("access_token");
                cookies.remove("userId");
                router.push("/");
              }}
            >
              <LogoutRoundedIcon />
              Выход
            </MenuItem>
          </Menu>
        </Dropdown>
      </Box>
    </Box>
  );
}
