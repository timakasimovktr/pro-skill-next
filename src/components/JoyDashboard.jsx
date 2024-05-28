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
  const [notes, setNotes] = React.useState([]);
  const [editNote, setEditNote] = React.useState([]);
  const [openCreateNote, setOpenCreateNote] = React.useState(false);
  const [openUpdateNote, setOpenUpdateNote] = React.useState(false);
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          text: "Kurs",
        });
      }
      if (response.data.isLessonPaid) {
        console.log(response.data.isLessonPaid, "isLessonPaid");
        newCourses.push({
          el: response.data.courses,
          text: "Dars",
        });
      }
      if (response.data.isModulePaid) {
        console.log(response.data.isModulePaid, "isModulePaid");
        newCourses.push({
          el: response.data.courses,
          text: "Modul",
        });
      }

      setBoughtCourses(newCourses);
    } catch (error) {
      console.log(error);
    }
  };

  const getNotes = async () => {
    axios
      .get(APP_ROUTES.URL + "/notes", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(function (response) {
        setNotes(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const createNote = async (e) => {
    e.preventDefault();
    setOpenCreateNote(false);

    const form = e.target;
    const data = new FormData(form);
    const title = data.get("title");
    const description = data.get("description");

    axios
      .post(
        APP_ROUTES.URL + "/notes",
        {
          title,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(function (response) {
        getNotes();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const deleteNote = async (id) => {
    axios
      .delete(APP_ROUTES.URL + "/notes/" + id, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(function (response) {
        getNotes();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const updateNote = (id) => {
    console.log(notes);
    console.log(id);
    setEditNote(notes.find((note) => note.id === id));
    setOpenUpdateNote(true);
  };

  const updateNoteByContent = async (id, e) => {
    e.preventDefault();
    setOpenUpdateNote(false);

    const form = e.target;
    const data = new FormData(form);
    const title = data.get("title");
    const description = data.get("description");

    axios
      .patch(
        APP_ROUTES.URL + "/notes/" + +id,
        {
          title,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(function (response) {
        getNotes();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  React.useEffect(() => {
    getNews();
    getNotes();
    getProfile();
    getBought();
  }, []);

  return (
    <CssVarsProvider disableTransitionOnChange>
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
          {/* =======================POPUP======================== */}

          {openCreateNote && (
            <DialogContainer onClose={() => setOpenCreateNote(false)}>
              <DialogPopup onClose={(e) => e.stopPropagation()}>
                <form onSubmit={(e) => createNote(e)}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    <FormControl>
                      <FormLabel>Eslatma qoshish</FormLabel>
                      <Input type="text" name="title" />
                    </FormControl>

                    <FormControl required>
                      <FormLabel>Matn</FormLabel>
                      <Textarea minRows={4} name="description" />
                    </FormControl>
                    <Box>
                      <Button type="submit" fullWidth sx={{
                        bgcolor: "#4C6A55"
                      }}>
                        Saqlash
                      </Button>
                    </Box>
                  </Box>
                </form>
              </DialogPopup>
            </DialogContainer>
          )}

          {openUpdateNote && (
            <DialogContainer onClose={() => setOpenUpdateNote(false)}>
              <DialogPopup onClose={(e) => e.stopPropagation()}>
                <form onSubmit={(e) => updateNoteByContent(editNote.id, e)}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    <FormControl>
                      <FormLabel>Eslatma qoshish</FormLabel>
                      <Input
                        type="text"
                        name="title"
                        value={editNote ? editNote.title : ""}
                        onChange={(e) =>
                          setEditNote({ ...editNote, title: e.target.value })
                        }
                      />
                    </FormControl>

                    <FormControl required>
                      <FormLabel>Matn</FormLabel>
                      <Textarea
                        type="text"
                        minRows={4}
                        value={editNote ? editNote.description : ""}
                        onChange={(e) =>
                          setEditNote({
                            ...editNote,
                            description: e.target.value,
                          })
                        }
                        name="description"
                      />
                    </FormControl>
                    <Box>
                      <Button type="submit" fullWidth sx={{
                        bgcolor: "#4C6A55"
                      }}>
                        Saqlash
                      </Button>
                    </Box>
                  </Box>
                </form>
              </DialogPopup>
            </DialogContainer>
          )}

          {/* =======================POPUP======================== */}

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
                  Xush kelibsiz {profile.fullName}!
                </Typography>
                <Typography level="body-sm" sx={{ color: "white" }}>
                  Shaxsiy hisobingizga xush kelibsiz. Bu erda siz bizning barcha
                  xizmatlarimizdan foydalanishingiz mumkin.
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            className="mainWrapper"
            sx={{ marginTop: "15px", display: "flex", gap: "15px" }}
          >
            <Box sx={{ width: "70%", overflowY: "auto", paddingBottom: "20px" }} className="boughtProductsWrapper">
              <Typography
                level="title-lg"
                sx={{
                  marginBottom: "15px",
                  color: "#50963b",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Sotib olingan kurslar
                <InventoryRoundedIcon
                  sx={{ color: "#50963b", width: "20px", marginLeft: "10px" }}
                />
              </Typography>
              <Box sx={{ display: "flex", gap: "15px", flexWrap: "wrap", paddingRight: "10px" }}>
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
                          color="success"
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
                                sx={{ color: "#50963b", fontWeight: "500" }}
                              >
                                Tolov qilingan
                              </Typography>
                              <SouthEastRoundedIcon
                                sx={{ color: "#50963b", width: "20px" }}
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
                        style={{ width: "calc(50% - 7.5px)" }}
                        className="soldProductCard"
                      >
                        <Card
                          className="beautyBlock"
                          color="success"
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
                              src={APP_ROUTES.URL + el.item.photoUrl}
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
                                Tolov qilingan
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
                    Siz hali hech narsa sotib olmadingiz!
                  </Typography>
                )}
              </Box>
            </Box>
            <Divider
              orientation="vertical"
              className="dashboardDivider beautyDivider"
            />
            <Box sx={{ width: "30%", overflowY: "auto", paddingRight: "10px" }} className="newsWrapper">
              {news.length > 0 && (
                <Typography
                  level="title-md"
                  sx={{
                    marginBottom: "15px",
                    color: "#50963b",
                    fontWeight: "500",
                  }}
                >
                  Yangiliklar
                  <NewspaperRoundedIcon
                    sx={{ color: "#50963b", width: "20px", marginLeft: "10px" }}
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
                        color="success"
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
                          <Typography level="title-md">{item.title}</Typography>
                          <Typography level="body-sm">
                            {item.createdAt.slice(0, 10)}
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
                              Tomosha qiling
                            </Typography>
                            <SouthEastRoundedIcon
                              sx={{ color: "#50963b", width: "20px" }}
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
        <Sheet
          className="sideSheet"
          sx={{
            display: { sm: "initial" },
            borderLeft: "1px solid",
            borderTop: { xs: "1px solid", sm: "none" },
            borderColor: "neutral.outlinedBorder",
            height: "calc(100vh - 64px)",
            overflowY: "auto",
          }}
        >
          <Box sx={{ p: 2, display: "flex", alignItems: "center", overflowY: "auto" }}>
            <Typography level="title-md" sx={{ flex: 1}}>
              Foydali funktsiyalar
            </Typography>
            {/* <IconButton
              component="span"
              variant="plain"
              color="neutral"
              size="sm"
            >
              <CloseRoundedIcon />
            </IconButton> */}
          </Box>
          <Divider className="beautyDivider" />
          <Tabs>
            <TabList>
              <Tab sx={{ flexGrow: 1 }}>
                <Typography level="title-sm">Eslatmalar</Typography>
              </Tab>
              <Tab sx={{ flexGrow: 1 }}>
                <Typography level="title-sm">Xabarlar</Typography>
              </Tab>
            </TabList>
            <TabPanel
              value={0}
              sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography level="title-md">
                    Sizning eslatmalaringiz
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    component="span"
                    variant="plain"
                    color="neutral"
                    size="md"
                    onClick={() => setOpenCreateNote(true)}
                  >
                    <AddRoundedIcon sx={{ color: "#50963b" }} />
                  </IconButton>
                </Box>
              </Box>
              {notes.map((note, index) => {
                return (
                  <Box
                    className="beautyBlock"
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexDirection: "column",
                      gap: 1,
                      border: "1px solid #32383e40",
                      padding: "20px",
                      borderRadius: "15px",
                      bgcolor: "#4C6A55"
                    }}
                  >
                    <div>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          alignItems: "flex-start",
                          flexDirection: "column",
                          justifyContent: "center",
                          mb: 1,
                        }}
                      >
                        <Typography
                          level="title-md"
                          sx={{ alignItems: "center", fontWeight: 600, color: "white" }}
                        >
                          {note.title}
                        </Typography>{" "}
                        <Typography
                          level="title-sm"
                          sx={{
                            alignItems: "center",
                            overflowWrap: "anywhere",
                            color: "white"
                          }}
                        >
                          {note.description}
                        </Typography>
                      </Box>
                    </div>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Typography level="body-xs" sx={{ mt: 1, color: "white" }}>
                          {note.createdAt.slice(0, 10)}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton
                          component="span"
                          variant="plain"
                          color="neutral"
                          size="sm"
                          onClick={() => updateNote(note.id)}
                        >
                          <CreateRoundedIcon sx={{ color: "white" }}/>
                        </IconButton>
                        <IconButton
                          component="span"
                          variant="plain"
                          color="neutral"
                          size="sm"
                          onClick={() => deleteNote(note.id)}
                        >
                          <DeleteRoundedIcon sx={{ color: "white" }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
              {/* Заметки */}
            </TabPanel>
            <TabPanel value={1} sx={{ p: 0 }}>
              <AspectRatio ratio="21/9">
                <Image
                  alt=""
                  width="400"
                  height="200"
                  src="https://www.gazeta.uz/media/img/2022/01/DhxJJ316424213436263_b.jpg"
                  srcSet="https://www.gazeta.uz/media/img/2022/01/DhxJJ316424213436263_b.jpg 2x"
                />
              </AspectRatio>
            </TabPanel>
          </Tabs>
        </Sheet>
      </Layout.Root>
    </CssVarsProvider>
  );
}
