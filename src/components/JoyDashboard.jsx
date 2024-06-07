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

import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SouthEastRoundedIcon from "@mui/icons-material/SouthEastRounded";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import NewspaperRoundedIcon from "@mui/icons-material/NewspaperRounded";

import Layout from "./dashboard/Layout";
import Navigation from "./dashboard/Navigation";
import Header from "./dashboard/Header";
import CustomRightSideBar from "./CustomRightSideBar";
import DisableRightClick from "./DisableRightClick";

import DialogContainer from "./DialogContainer";
import DialogPopup from "./DialogPopup";

import axios from "axios";
import { useCookies } from "next-client-cookies";
import { APP_ROUTES } from "./Route";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const cookies = useCookies();
  const access_token = cookies.get("access_token");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [news, setNews] = React.useState([]);
  const [profile, setProfile] = React.useState({});
  const [bought, setBought] = React.useState([]);
  const [boughtCourses, setBoughtCourses] = React.useState([]);

  const getNews = async () => {
    axios
      .get(APP_ROUTES.URL + "/news")
      .then(function (response) {
        setNews(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getBought = async () => {
    axios
      .get(APP_ROUTES.URL + "/item/bought", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response) => {
        setBought(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

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
    getNews();
    getProfile();
    getBought();
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
                  Добро пожаловать {profile.fullName}!
                </Typography>
                <Typography level="body-sm" sx={{ color: "white" }}>
                  Добро пожаловать в личный кабинет. Здесь вы можете
                  воспользоваться всеми нашими услугами.
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            className="mainWrapper"
            sx={{ marginTop: "15px", display: "flex", gap: "10px" }}
          >
            <Box
              sx={{ width: "70%", overflowY: "auto", paddingBottom: "20px" }}
              className="boughtProductsWrapper"
            >
              <Typography
                level="title-lg"
                sx={{
                  marginBottom: "15px",
                  color: "#4C6A55",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Купленные материалы
                <InventoryRoundedIcon
                  sx={{ color: "#4C6A55", width: "20px", marginLeft: "10px" }}
                />
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: "15px",
                  flexWrap: "wrap",
                  paddingRight: { xs: 0, md: "10px" },
                }}
              >
                {bought.length > 0 || profile.courses ? (
                  <>
                    {boughtCourses.map((el, index) => (
                      <a
                        href="/dashboard/course"
                        key={index}
                        style={{ width: "calc(50% - 7.5px)" }}
                        className="soldProductCard"
                      >
                        <Card
                          className="beautyBlock"
                          variant="outlined"
                          invertedColors
                          orientation="vertical"
                          size="sm"
                          sx={{ width: "100%", borderRadius: "20px" }}
                        >
                          <AspectRatio minHeight="120px" maxHeight="200px">
                            <img
                              src={APP_ROUTES.URL + "/" + el.el.photoUrls[0]}
                              srcSet={APP_ROUTES.URL + "/" + el.el.photoUrls[0]}
                              loading="lazy"
                              alt={el.el.title}
                            />
                          </AspectRatio>
                          <div>
                            <Typography level="title-md">
                              {el.el.title}
                            </Typography>
                            <div className="chip">
                              <Typography level="body-xs">{el.text}</Typography>
                            </div>
                            <Typography level="body-sm">
                              {el.el.description.slice(0, 90) + "..."}
                            </Typography>
                            <Box
                              sx={{
                                width: "100%",
                                marginTop: "10px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                level="body-sm"
                                sx={{ color: "#4C6A55", fontWeight: "500" }}
                              >
                                Купленно
                              </Typography>
                              <SouthEastRoundedIcon
                                sx={{ color: "#4C6A55", width: "20px" }}
                              />
                            </Box>
                          </div>
                        </Card>
                      </a>
                    ))}

                    {bought.map((el, index) => (
                      <a
                        href={`${APP_ROUTES.URL}/${el.item.fileUrl}`}
                        key={index}
                        style={{ width: xs ? "100%" : "calc(50% - 7.5px)" }}
                        className="soldProductCard"
                      >
                        <Card
                          className="beautyBlock"
                          variant="outlined"
                          invertedColors
                          orientation="vertical"
                          size="sm"
                          sx={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "20px",
                          }}
                        >
                          <AspectRatio minHeight="120px" maxHeight="200px">
                            <Image
                              src={APP_ROUTES.URL + "/" + el.item.photoUrl}
                              srcSet={APP_ROUTES.URL + "/" + el.item.photoUrl}
                              loading="lazy"
                              alt={el.item.title}
                              width="400"
                              height="200"
                            />
                          </AspectRatio>
                          <div
                            style={{
                              height: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              flexDirection: "column",
                            }}
                          >
                            <Typography level="title-md">
                              {el.item.title}
                            </Typography>
                            <Typography level="body-sm">
                              {el.item.subtitle}
                            </Typography>
                            <Box
                              sx={{
                                width: "100%",
                                marginTop: "10px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                level="body-sm"
                                sx={{ color: "#50963b", fontWeight: "500" }}
                              >
                                Купленно
                              </Typography>
                              <SouthEastRoundedIcon
                                sx={{ color: "#50963b", width: "20px" }}
                              />
                            </Box>
                          </div>
                        </Card>
                      </a>
                    ))}
                  </>
                ) : (
                  <Typography
                    level="title-md"
                    sx={{
                      color: "neutral.outlinedColor",
                      width: "100%",
                    }}
                  >
                    Вы еще не купили ни одного материала или курса! <br />
                    <a href="https://proskill-academy.com" title="proskill" style={{fontSize: "24px", textDecoration: "underline"}}>Купить курсы!</a>
                  </Typography>
                )}
              </Box>
            </Box>
            {/* <Divider
              orientation="vertical"
              className="dashboardDivider beautyDivider"
            /> */}
            <Box
              sx={{
                width: "30%",
                overflowY: "auto",
                paddingRight: { xs: 0, md: "10px" },
              }}
              className="newsWrapper"
            >
              {news.length > 0 && (
                <Typography
                  level="title-md"
                  sx={{
                    marginBottom: "15px",
                    color: "#4C6A55",
                    fontWeight: "500",
                  }}
                >
                  Новости
                  <NewspaperRoundedIcon
                    sx={{ color: "#4C6A55", width: "20px", marginLeft: "10px" }}
                  />
                </Typography>
              )}
              {news.length > 0 &&
                news.map((item, index) => {
                  return (
                    <a
                      href={item.mainUrl}
                      key={index}
                      target="_blank"
                      style={{ width: "calc(50% - 7.5px)" }}
                      className="soldProductCard"
                    >
                      <Card
                        className="beautyBlock"
                        variant="outlined"
                        invertedColors
                        orientation="vertical"
                        size="sm"
                        sx={{
                          width: "100%",
                          marginBottom: "15px",
                          borderRadius: "20px",
                        }}
                      >
                        <AspectRatio minHeight="120px" maxHeight="200px">
                          <Image
                            src={APP_ROUTES.URL + "/" + item.photoUrl}
                            srcSet={APP_ROUTES.URL + "/" + item.photoUrl}
                            loading="lazy"
                            width="400"
                            height="200"
                            alt=""
                          />
                        </AspectRatio>
                        <div>
                          <Typography
                            level="title-md"
                            sx={{ fontSize: "12px" }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            level="body-sm"
                            sx={{ fontSize: "12px", marginTop: "5px" }}
                          >
                            {item.createdAt.slice(0, 10)}
                          </Typography>
                          <Box
                            sx={{
                              width: "100%",
                              marginTop: "5px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              level="body-sm"
                              sx={{
                                color: "#4C6A55",
                                fontWeight: "500",
                                fontSize: "12px",
                              }}
                            >
                              Читать далее
                            </Typography>
                            <SouthEastRoundedIcon
                              sx={{ color: "#4C6A55", width: "15px" }}
                            />
                          </Box>
                        </div>
                      </Card>
                    </a>
                  );
                })}
            </Box>
          </Box>
        </Layout.Main>
        <CustomRightSideBar />
        <DisableRightClick />
      </Layout.Root>
    </CssVarsProvider>
  );
}
