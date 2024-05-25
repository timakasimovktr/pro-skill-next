/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import AspectRatio from "@mui/joy/AspectRatio";
import Avatar from "@mui/joy/Avatar";
import AvatarGroup from "@mui/joy/AvatarGroup";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import Divider from "@mui/joy/Divider";
import Sheet from "@mui/joy/Sheet";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListDivider from "@mui/joy/ListDivider";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Stack from "@mui/joy/Stack";
import Chip from "@mui/joy/Chip";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Badge from "@mui/material/Badge";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Textarea from "@mui/joy/Textarea";

import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./dashboard/Layout";
import Navigation from "./dashboard/Navigation";
import Header from "./dashboard/Header";

import DialogContainer from "./DialogContainer";
import DialogPopup from "./DialogPopup";
import CourseAccordion from "./CourseAccordion.jsx";

import axios from "axios";
import { useCookies } from "next-client-cookies";
import { APP_ROUTES } from "./Route";
import { useRouter } from "next/navigation";

const CourseDashboard = () => {
  const router = useRouter();
  const cookies = useCookies();
  const access_token = cookies.get("access_token");
  const [profile, setProfile] = React.useState({});
  const [notes, setNotes] = React.useState([]);
  const [editNote, setEditNote] = React.useState([]);
  const [openCreateNote, setOpenCreateNote] = React.useState(false);
  const [openUpdateNote, setOpenUpdateNote] = React.useState(false);
  const [currentVideo, setCurrentVideo] = React.useState("");
  const [currentQuestions, setCurrentQuestions] = React.useState([]);
  const [currentLesson, setCurrentLesson] = React.useState({});

  const onSubmitTests = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const listAnswers = [];
    const listQuestionIds = [];
    for (let pair of data.entries()) {
      listAnswers.push(+pair[1]);
      listQuestionIds.push(+pair[0].slice(6));
    }

    if (currentQuestions.length !== listAnswers.length) {
      toast.error("Barcha savollarga javob bering");
      return;
    }

    axios
      .post(
        APP_ROUTES.URL + "/check",
        {
          questions: listQuestionIds,
          answers: listAnswers,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(function (response) {
        toast.success("Sinov yakunlandi");
        getProfile();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getNotes = useCallback(async () => {
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
  });

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

  const getProfile = async () => {
    axios
      .get(APP_ROUTES.URL + "/auth/profile", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(function (response) {
        if (response.data.courses) {
          setProfile(response.data);
        } else {
          router.push("/dashboard");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  React.useLayoutEffect(() => {
    getProfile();
    getNotes();
  }, [getNotes, getProfile]);

  return (
    <CssVarsProvider>
      <CssBaseline />

      <Layout.Root
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Layout.Header>
          <Header profile={profile} />
        </Layout.Header>
        <Layout.Main sx={{ width: "100%", padding: 0 }}>
          <ToastContainer />
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
                      <Button type="submit" fullWidth>
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
                      <Button type="submit" fullWidth>
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
              minWidth: "100%",
              height: "calc(100vh - 200px)",
              minHeight: "400px",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              borderBottom: "1px solid",
              borderColor: "neutral.outlinedBorder",
            }}
          >
            <Box
              sx={{
                width: "75%",
                height: "calc(100vh - 201px)",
                minHeight: "400px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <video
                src={currentVideo}
                controls
                style={{
                  width: "100%",
                  height: "calc(100vh - 201px)",
                  minHeight: "400px",
                  backgroundColor: "#2d2f31",
                }}
              >
                <source src={currentVideo} type="video/mp4" />
              </video>
            </Box>
            <Box
              sx={{
                width: "25%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                overflowY: "auto",
                height: "calc(100vh - 201px)",
                minHeight: "400px",
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  width: "100%",
                  borderRadius: "0px",
                  margin: "0px",
                  color: "primary.main",
                  padding: "10px 21px",
                  borderBottom: "1px solid",
                  borderColor: "neutral.outlinedBorder",
                }}
              >
                {profile.courses?.title}
              </Typography>
              <CourseAccordion
                setCurrentVideo={setCurrentVideo}
                setCurrentQuestions={setCurrentQuestions}
                setCurrentLesson={setCurrentLesson}
                profile={profile}
              />
            </Box>
          </Box>
          <Box sx={{ width: "100%", display: "flex" }}>
            <Box
              sx={{
                width: "50%",
              }}
            >
              <Tabs
                aria-label="Basic tabs"
                defaultValue={0}
                className="lessonInfoContainer"
              >
                <TabList>
                  <Tab color="success">Kurs haqida malumot</Tab>
                  <Tab color="success">Sinovlar</Tab>
                  <Tab color="success">Eslatmalar</Tab>
                </TabList>
                <TabPanel value={0} className="courseInfoTabPanel">
                  <h2 style={{ marginBottom: "5px" }}>
                    Dars nomi: {currentLesson?.title}
                  </h2>
                  <h2
                    style={{
                      marginBottom: "5px",
                      fontSize: "18px",
                      opacity: "0.8",
                    }}
                  >
                    Kurs nomi: {profile?.courses?.title}
                  </h2>
                  <h4 style={{ marginBottom: "5px" }}>
                    Muallif: {profile?.courses?.author}
                  </h4>
                  <h4 style={{ marginBottom: "10px" }}>
                    Davomiyligi: {profile?.courses?.time}
                  </h4>
                  <Divider className="beautyDivider" />
                  <p style={{ marginTop: "10px" }}>
                    {profile?.courses?.description}
                  </p>
                </TabPanel>
                <TabPanel value={1} className="courseInfoTabPanel">
                  <Box>
                    {profile.completedLessons?.some(
                      (completedLesson) =>
                        completedLesson.lessonId === currentLesson.id
                    ) && (
                      <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        minHeight: "400px",
                        backgroundImage: `url(https://images.pexels.com/photos/1925536/pexels-photo-1925536.jpeg)`,
                        backgroundSize: "cover",
                      }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                            padding: "20px",
                            borderRadius: "8px",
                          }}
                        >
                          <h2 style={{ color: "white", fontSize: "20px" }}>
                            Sinov tugadi. Sizning natijangiz:
                          </h2>
                        </Box>
                        <Box
                          sx={{
                            marginTop: "10px",
                            width: "130px",
                            height: "130px",
                            backgroundColor: "#50963b",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "50%",
                            fontSize: "30px",
                            color: "white",
                            transition: "0.3s",
                            "&:hover": {
                              backgroundColor: "#3b7a4f",
                            },
                          }}
                        >
                          {
                            profile.completedLessons
                              .find(
                                (completedLesson) =>
                                  completedLesson.lessonId === currentLesson.id
                              )
                              .answers.filter((answer) => answer).length
                          } / {currentQuestions.length}
                        </Box>
                      </Box>
                    )}

                    {!profile.completedLessons?.some(
                      (completedLesson) =>
                        completedLesson.lessonId === currentLesson.id
                    ) && (
                      <form onSubmit={onSubmitTests}>
                        {currentQuestions.map((question, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                              marginBottom: "15px",
                            }}
                          >
                            <h3>
                              {index + 1}) {question.title}
                            </h3>
                            {question.answers.map((answer, index) => (
                              <Box
                                key={index}
                                sx={{ display: "flex", gap: "10px" }}
                              >
                                <input
                                  type="radio"
                                  name={`answer${question.id}`}
                                  id={`answer${question.id}_${index}`}
                                  value={answer.id}
                                />
                                <label
                                  htmlFor={`answer${question.id}_${index}`}
                                >
                                  <h4>{answer.title}</h4>
                                </label>
                              </Box>
                            ))}
                          </Box>
                        ))}
                        <Button
                          className="courseInfoTabPanelButton"
                          color="primary"
                          type="submit"
                        >
                          Sinovni tugating
                        </Button>
                      </form>
                    )}
                  </Box>
                </TabPanel>
                <TabPanel value={2} className="courseInfoTabPanel">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
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
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          flexDirection: "column",
                          gap: 1,
                          border: "1px solid #32383e40",
                          padding: "20px",
                          borderRadius: "8px",
                          marginBottom: "10px",
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
                              sx={{ alignItems: "center", fontWeight: 600 }}
                            >
                              {note.title}
                            </Typography>{" "}
                            <Typography
                              level="title-sm"
                              sx={{
                                alignItems: "center",
                                overflowWrap: "anywhere",
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
                            <Typography level="body-xs" sx={{ mt: 1 }}>
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
                              <CreateRoundedIcon />
                            </IconButton>
                            <IconButton
                              component="span"
                              variant="plain"
                              color="neutral"
                              size="sm"
                              onClick={() => deleteNote(note.id)}
                            >
                              <DeleteRoundedIcon sx={{ color: "red" }} />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                  {/* Заметки */}
                </TabPanel>
              </Tabs>
            </Box>
            <Divider orientation="vertical" className="beautyDivider" />
            <Box sx={{ width: "50%" }}>
              <Tabs
                aria-label="Vertical tabs"
                sx={{ width: "100%", height: "100%", minHeight: "400px" }}
              >
                <TabList>
                  <Tab>Shashka</Tab>
                  <Tab>Iloncha</Tab>
                  <Tab>Shaxmat</Tab>
                </TabList>
                <TabPanel value={0}>
                  <iframe
                    src="https://f3.silvergames.com/m/master-checkers/"
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: "400px",
                    }}
                  ></iframe>
                </TabPanel>
                <TabPanel value={1}>
                  <iframe
                    src="https://f3.silvergames.com/m/snake/"
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: "400px",
                    }}
                  ></iframe>
                </TabPanel>
                <TabPanel value={2}>
                  <iframe
                    src="https://f3.silvergames.com/m/master-chess/"
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: "400px",
                    }}
                  ></iframe>
                </TabPanel>
              </Tabs>
            </Box>
          </Box>
        </Layout.Main>
      </Layout.Root>
    </CssVarsProvider>
  );
};

export default CourseDashboard;
