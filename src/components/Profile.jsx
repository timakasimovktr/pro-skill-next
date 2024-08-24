/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable @next/next/no-img-element */
"use client";
import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import Divider from "@mui/joy/Divider";
import Sheet from "@mui/joy/Sheet";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Textarea from "@mui/joy/Textarea";
import Image from "next/image";
import Stack from "@mui/joy/Stack";
import CardOverflow from "@mui/joy/CardOverflow";
import CardActions from "@mui/joy/CardActions";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";

import Layout from "./dashboard/Layout";
import Navigation from "./dashboard/Navigation";
import Header from "./dashboard/Header";
import CustomRightSideBar from "./CustomRightSideBar";

import DialogContainer from "./DialogContainer";
import DialogPopup from "./DialogPopup";

import axios from "axios";
import { useCookies } from "next-client-cookies";
import { APP_ROUTES } from "./Route";
import { useRouter } from "next/navigation";

export default function Profile() {
  const cookies = useCookies();
  const access_token = cookies.get("access_token");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [profile, setProfile] = React.useState({});

  const getProfile = async () => {
    try {
      const response = await axios.get(APP_ROUTES.URL + "/auth/profile", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      setProfile(response.data);

      const newCourses = [];

      if (response.data.isCoursePaid) {
        console.log(response.data.isCoursePaid, "isCoursePaid");
        newCourses.push({
          el: response.data.courses,
          text: "Курс",
        });
      }
      if (response.data.isLessonPaid) {
        console.log(response.data.isLessonPaid, "isLessonPaid");
        newCourses.push({
          el: response.data.courses,
          text: "Урок",
        });
      }
      if (response.data.isModulePaid) {
        console.log(response.data.isModulePaid, "isModulePaid");
        newCourses.push({
          el: response.data.courses,
          text: "Модуль",
        });
      }

      setBoughtCourses(newCourses);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getProfile();
  }, []);

  return (
    <CssVarsProvider>
      <CssBaseline />
      {drawerOpen && (
        <Layout.SideDrawer onClose={() => setDrawerOpen(false)}>
          <Navigation />
        </Layout.SideDrawer>
      )}
      <Layout.Root
        sx={{
          gridTemplateColumns: {
            xs: "1fr",
            sm: "minmax(64px, 200px) minmax(450px, 1fr)",
            md: "minmax(140px, 240px) minmax(600px, 1fr) minmax(250px, 320px)",
          },
          width: "100%",
          ...(drawerOpen && {
            height: "100vh",
            overflow: "hidden",
          }),
        }}
      >
        <Layout.Header className="beautyHeader">
          <Header profile={profile} />
        </Layout.Header>
        <Layout.SideNav
          sx={{ height: "calc(100vh - 64px)", overflowY: "auto" }}
          className="sideNav"
        >
          <Navigation />
        </Layout.SideNav>
        <Layout.Main
          sx={{
            height: "calc(100vh - 64px)",
            overflowY: "hidden",
            width: "100%",
          }}
          className="mainContainer"
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 2,
            }}
          >
            <Box
              variant="outlined"
              className="beautyBlock"
              sx={{
                border: "1px solid",
                borderColor: "neutral.outlinedBorder",
                borderRadius: "20px",
                bgcolor: "#8EA488",
                gridColumn: "1/-1",
                display: "flex",
                padding: "20px 20px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  level="title-md"
                  sx={{ fontSize: 20, fontWeight: 700, color: "white" }}
                >
                 Xush kelibsiz, {profile.fullName}!
                </Typography>
                <Typography level="body-sm" sx={{ color: "white" }}>
                Shaxsiy hisobingizga xush kelibsiz. Bu yerda mumkin
                barcha xizmatlarimizdan foydalaning.
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            className="mainWrapper"
            sx={{
              marginTop: "15px",
              display: "flex",
              gap: "15px",
              paddingBottom: "15px",
            }}
          >
            <Card
              sx={{
                width: "100%",
                height: "min-content",
                borderRadius: "20px",
              }}
            >
              <Box sx={{ mb: 1 }}>
                <Typography level="title-md">Shaxsiy ma&apos;lumot</Typography>
                <Typography level="body-sm">
                Sizning shaxsiy ma&apos;lumotlaringiz bu erda ko&apos;rsatiladi.
                </Typography>
              </Box>
              <Divider />
              <Stack
                direction="row"
                spacing={3}
                sx={{ display: { xs: "none", md: "flex" }, my: 1 }}
              >
                <Stack direction="column" spacing={1}>
                  <AspectRatio
                    ratio="1"
                    maxHeight={200}
                    sx={{ flex: 1, minWidth: 120, borderRadius: "100%" }}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
                      srcSet="https://cdn-icons-png.flaticon.com/512/6596/6596121.png 2x"
                      loading="lazy"
                      alt=""
                    />
                  </AspectRatio>
                </Stack>
                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                  <Stack spacing={1}>
                    <FormLabel>To&apos;liq ism</FormLabel>
                    <FormControl
                      sx={{
                        display: { sm: "flex-column", md: "flex-row" },
                        gap: 2,
                      }}
                    >
                      <Input
                        readOnly
                        size="sm"
                        placeholder="First name"
                        value={profile.fullName}
                        sx={{ borderRadius: "10px" }}
                      />
                    </FormControl>
                  </Stack>
                  <Stack spacing={1}>
                    <FormLabel>Shahar</FormLabel>
                    <FormControl
                      sx={{
                        display: { sm: "flex-column", md: "flex-row" },
                        gap: 2,
                      }}
                    >
                      <Input
                        readOnly
                        size="sm"
                        placeholder="First name"
                        value={profile.city}
                        sx={{ borderRadius: "10px" }}
                      />
                    </FormControl>
                  </Stack>
                  <Stack spacing={1}>
                    <FormLabel>Telefon raqami</FormLabel>
                    <FormControl
                      sx={{
                        display: { sm: "flex-column", md: "flex-row" },
                        gap: 2,
                      }}
                    >
                      <Input
                        readOnly
                        size="sm"
                        placeholder="First name"
                        value={profile.phoneNumber}
                        sx={{ borderRadius: "10px" }}
                      />
                    </FormControl>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <FormControl>
                      <FormLabel>Rol</FormLabel>
                      <Input readOnly size="sm" defaultValue="Студент" />
                    </FormControl>
                    <FormControl sx={{ flexGrow: 1 }}>
                      <FormLabel>E-mail</FormLabel>
                      <Input
                        readOnly
                        size="sm"
                        type="email"
                        startDecorator={<EmailRoundedIcon />}
                        placeholder="email"
                        value={profile.email}
                        defaultValue="siriwatk@test.com"
                        sx={{ flexGrow: 1 }}
                      />
                    </FormControl>
                  </Stack>
                </Stack>
              </Stack>
              <Stack
                direction="column"
                spacing={2}
                sx={{ display: { xs: "flex", md: "none" }, my: 1 }}
              >
                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                  <Stack spacing={1}>
                    <FormLabel>To&apos;liq ism</FormLabel>
                    <FormControl
                      sx={{
                        display: { sm: "flex-column", md: "flex-row" },
                        gap: 2,
                      }}
                    >
                      <Input
                        readOnly
                        size="sm"
                        placeholder="First name"
                        value={profile.fullName}
                        sx={{ borderRadius: "10px" }}
                      />
                    </FormControl>
                  </Stack>
                  <Stack spacing={1}>
                    <FormLabel>Shahar</FormLabel>
                    <FormControl
                      sx={{
                        display: { sm: "flex-column", md: "flex-row" },
                        gap: 2,
                      }}
                    >
                      <Input
                        readOnly
                        size="sm"
                        placeholder="First name"
                        value={profile.city}
                        sx={{ borderRadius: "10px" }}
                      />
                    </FormControl>
                  </Stack>
                  <Stack spacing={1}>
                    <FormLabel>Telefon raqami</FormLabel>
                    <FormControl
                      sx={{
                        display: { sm: "flex-column", md: "flex-row" },
                        gap: 2,
                      }}
                    >
                      <Input
                        readOnly
                        size="sm"
                        placeholder="First name"
                        value={profile.phoneNumber}
                        sx={{ borderRadius: "10px" }}
                      />
                    </FormControl>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <FormControl>
                      <FormLabel>Rol</FormLabel>
                      <Input readOnly size="sm" defaultValue="Студент" />
                    </FormControl>
                    <FormControl sx={{ flexGrow: 1 }}>
                      <FormLabel>E-mail</FormLabel>
                      <Input
                        readOnly
                        size="sm"
                        type="email"
                        startDecorator={<EmailRoundedIcon />}
                        placeholder="email"
                        value={profile.email}
                        defaultValue="siriwatk@test.com"
                        sx={{ flexGrow: 1 }}
                      />
                    </FormControl>
                  </Stack>
                </Stack>
              </Stack>
            </Card>
          </Box>
        </Layout.Main>
        <CustomRightSideBar />
      </Layout.Root>
    </CssVarsProvider>
  );
}
