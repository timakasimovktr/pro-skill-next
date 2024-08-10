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

import Layout from "./dashboard/Layout";
import Navigation from "./dashboard/Navigation";
import Header from "./dashboard/Header";
import CustomRightSideBar from "./CustomRightSideBar";
import DisableRightClick from "./DisableRightClick";

import axios from "axios";
import { useCookies } from "next-client-cookies";
import { APP_ROUTES } from "./Route";
import { useRouter } from "next/navigation";
import MyMessages from "./components/MyMessages";

export default function Chat() {
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
          <MyMessages />
        </Layout.Main>
        <CustomRightSideBar />
        <DisableRightClick />
      </Layout.Root>
    </CssVarsProvider>
  );
}
