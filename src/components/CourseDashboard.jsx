"use client";
import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import AspectRatio from "@mui/joy/AspectRatio";
import Avatar from "@mui/joy/Avatar";
import AvatarGroup from "@mui/joy/AvatarGroup";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
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
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";

import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./dashboard/Layout";
import Navigation from "./dashboard/Navigation";
import Header from "./dashboard/Header";

import DialogContainer from "./DialogContainer";
import DialogPopup from "./DialogPopup";
import CourseAccordion from "./CourseAccordion.jsx";
import DisableRightClick from "./DisableRightClick";

import axios from "axios";
import { useCookies } from "next-client-cookies";
import { APP_ROUTES } from "./Route";
import { useRouter } from "next/navigation";

const CourseDashboard = (props) => {
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
  const [openModal, setOpenModal] = React.useState(false);
  const [modalContent, setModalContent] = React.useState("");
  const [course, setCourse] = React.useState({});

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
      toast.error("Barcha testlarga javob bering");
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
        toast.success("Sinov tugallandi. Sizga ball berildi.");
        getProfile();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getNotes = React.useCallback(async () => {
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
  }, [access_token]);

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

  const getCourse = React.useCallback(async () => {
    axios
      .get(APP_ROUTES.URL + `/courses/bought/${props.courseId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(function (response) {
        setCourse(response.data);
        if (response.data.modules) {
          if (response.data.modules[0].videoUrl) {
            setCurrentVideo(
              APP_ROUTES.URL + "/" + response.data.modules[0].videoUrl
            );
          } else {
            console.log("No video");
          }
          setCurrentQuestions(response.data.modules[0].questions);
          setCurrentLesson(response.data.modules[0]);
        } else {
          router.push("/dashboard");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [access_token, props.courseId]);

  const getProfile = React.useCallback(async () => {
    axios
      .get(APP_ROUTES.URL + "/auth/profile", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(function (response) {
        setProfile(response.data);
        // if (response.data.courses) {
        // } else {
        //   router.push("/dashboard");
        // }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [access_token, router]);

  React.useEffect(() => {
    getCourse();
    getProfile();
    getNotes();
  }, [getNotes, getProfile, getCourse]);

  return (
    <CssVarsProvider>
      <CssBaseline />

      <Layout.Root
        sx={{
          gridTemplateColumns: {
            xs: "1fr",
            sm: "minmax(64px, 200px) minmax(450px, 1fr)",
            md: "minmax(140px, 240px) minmax(600px, 1fr)",
          },
          width: "100%",
        }}
      >
        <Layout.Header>
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
            width: "100%",
            padding: 0,
            height: "calc(100vh - 64px)",
            overflowY: "auto",
          }}
        >
          <ToastContainer />
          {/* =======================POPUP======================== */}
          <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={openModal}
            onClose={() => setOpenModal(false)}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Sheet
              variant="outlined"
              sx={{
                maxWidth: 1000,
                width: "calc(100vw - 40px)",
                height: "calc(100vh - 200px)",
                borderRadius: "10px",
                p: 2,
                boxShadow: "lg",
              }}
            >
              <iframe
                style={{ borderRadius: "10px" }}
                src={`${APP_ROUTES.URL}/${modalContent}#toolbar=0`}
                width="100%"
                height="100%"
              />
            </Sheet>
          </Modal>

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
                      <FormLabel>Eslatma sarlavhasi</FormLabel>
                      <Input type="text" name="title" />
                    </FormControl>

                    <FormControl required>
                      <FormLabel>Tavsif</FormLabel>
                      <Textarea minRows={4} maxRows={15} name="description" />
                    </FormControl>
                    <Box>
                      <Button
                        type="submit"
                        fullWidth
                        sx={{
                          bgcolor: "#50963b",
                          "&:hover": {
                            bgcolor: "#4C6A55",
                          },
                        }}
                      >
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
                      <FormLabel>Eslatma sarlavhasi</FormLabel>
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
                      <FormLabel>Tavsif</FormLabel>
                      <Textarea
                        type="text"
                        minRows={4}
                        maxRows={15}
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
                      <Button
                        type="submit"
                        fullWidth
                        sx={{
                          bgcolor: "#50963b",
                          "&:hover": {
                            bgcolor: "#4C6A55",
                          },
                        }}
                      >
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
              height: { xs: "calc(100vh)", sm: "calc(100vh - 200px)" },
              minHeight: "400px",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              borderColor: "neutral.outlinedBorder",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box
              sx={{
                width: { xs: "100%", sm: "75%" },
                height: "calc(100vh - 200px)",
                minHeight: "400px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  minHeight: "400px",
                  padding: "10px",
                }}
              >
                <video
                  src={currentVideo}
                  controlsList="nodownload"
                  poster={
                    "https://www.gazeta.uz/media/img/2022/01/DhxJJ316424213436263_b.jpg"
                  }
                  controls
                  priority
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#4C6A55",
                    borderRadius: "20px",
                  }}
                >
                  <source src={currentVideo} type="video/mp4" />
                </video>
              </Box>
            </Box>
            <Box
              sx={{
                width: { xs: "100%", sm: "25%" },
                overflowY: "auto",
                height: "calc(100vh - 200px)",
                padding: { xs: "0px 10px 10px 10px", sm: "10px 10px 10px 0" },
                minHeight: "400px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  border: "#CDD7E1 solid 1px",
                  borderRadius: "20px",
                  overflow: "hidden",
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
                    bgcolor: "#4C6A55",
                    borderRadius: "20px 20px 0 0",
                  }}
                >
                  <span style={{ color: "white" }}>{course?.title}</span>
                </Typography>
                <CourseAccordion
                  setCurrentVideo={setCurrentVideo}
                  currentVideo={currentVideo}
                  setCurrentQuestions={setCurrentQuestions}
                  setCurrentLesson={setCurrentLesson}
                  currentLesson={currentLesson}
                  profile={profile}
                  courseInfo={course}
                />
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              backgroundColor: "#fff",
              marginTop: { xs: "10px", sm: "0px" },
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box
              sx={{
                width: { xs: "100%", sm: "55%" },
              }}
            >
              <Tabs
                aria-label="Basic tabs"
                defaultValue={0}
                className="lessonInfoContainer"
              >
                <TabList disableUnderline sx={{ paddingLeft: "10px" }}>
                  <Tab indicatorInset sx={{ borderRadius: "10px" }}>
                  Kurs haqida ma&apos;lumot
                  </Tab>
                  <Tab indicatorInset sx={{ borderRadius: "10px" }}>
                  Testlar
                  </Tab>
                </TabList>
                <TabPanel value={0} className="courseInfoTabPanel">
                  <h2 style={{ marginBottom: "5px" }}>
                  Dars nomi: {currentLesson?.title}
                  </h2>
                  <Box sx={{ mb: "20px", display: "flex", gap: "20px" }}>
                    {currentLesson?.items?.map((item, index) =>
                      item.split(".").pop() === "pptx" ? null : (
                        <Box
                          key={index}
                          sx={{ width: "120px", height: "50px" }}
                          onClick={() => {
                            setOpenModal(true);
                            setModalContent(item);
                          }}
                        >
                          <Box className="extraMaterials">
                            <OpenInFullIcon
                              sx={{ fontSize: "30px", fill: "white" }}
                              className="seeIcon"
                            />
                            <FileOpenIcon
                              className="seeIconHidden"
                              sx={{ fontSize: "22px", fill: "white", mr: 1 }}
                            />
                            <Typography level="title-sm">
                              {item.split(".").pop()}
                            </Typography>
                          </Box>
                        </Box>
                      )
                    )}
                  </Box>
                  <h2
                    style={{
                      marginBottom: "5px",
                      fontSize: "18px",
                      opacity: "0.8",
                    }}
                  >
                    Kurs nomi: {course?.title}
                  </h2>
                  <h4 style={{ marginBottom: "5px" }}>
                  Kurs muallifi: {course?.author}
                  </h4>
                  <h4 style={{ marginBottom: "10px" }}>
                  Davomiyligi: {course?.time}
                  </h4>
                  <Divider className="beautyDivider" />
                  <p style={{ marginTop: "10px" }}>{course?.description}</p>
                </TabPanel>
                <TabPanel value={1} className="courseInfoTabPanel">
                  <Box>
                    {profile.completedLessons?.some(
                      (completedLesson) =>
                        completedLesson.lessonId === currentLesson.id
                    ) && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                          borderRadius: "20px",
                          minHeight: "400px",
                          backgroundImage: `url(https://images.pexels.com/photos/1925536/pexels-photo-1925536.jpeg)`,
                          backgroundSize: "cover",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                            padding: "20px",
                            borderRadius: "15px",
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
                          }{" "}
                          / {currentQuestions.length}
                        </Box>
                      </Box>
                    )}

                    {!profile.completedLessons?.some(
                      (completedLesson) =>
                        completedLesson.lessonId === currentLesson.id
                    ) && (
                      <form onSubmit={onSubmitTests}>
                        {currentQuestions?.map((question, index) => (
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
                          Sinovni yakunlang
                        </Button>
                      </form>
                    )}
                  </Box>
                </TabPanel>
              </Tabs>
            </Box>
            <Divider orientation="vertical" className="beautyDivider" />
            <Box sx={{ width: { xs: "100%", sm: "45%" } }}>
              <Tabs
                aria-label="Vertical tabs"
                sx={{ width: "100%", height: "100%", minHeight: "400px" }}
              >
                <TabList disableUnderline sx={{ paddingLeft: "10px" }}>
                  <Tab indicatorInset sx={{ borderRadius: "10px" }}>
                  Eslatmalar
                  </Tab>
                  <Tab sx={{ borderRadius: "10px" }} indicatorInset>
                  Shashka
                  </Tab>
                  <Tab sx={{ borderRadius: "10px" }} indicatorInset>
                  Ilon
                  </Tab>
                  <Tab sx={{ borderRadius: "10px" }} indicatorInset>
                  Shaxmat
                  </Tab>
                </TabList>
                <TabPanel value={0} className="courseInfoTabPanel">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "#4C6A55",
                      marginBottom: "10px",
                    }}
                  >
                    <Box>
                      <Typography level="title-md">Sizning qaydlaringiz</Typography>
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
                          borderRadius: "15px",
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
                              className="shortDescription"
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
                              <VisibilityIcon />
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
                <TabPanel value={1}>
                  <iframe
                    src="https://f3.silvergames.com/m/master-checkers/"
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: "400px",
                      borderRadius: "20px",
                    }}
                  ></iframe>
                </TabPanel>
                <TabPanel value={2}>
                  <iframe
                    src="https://f3.silvergames.com/m/snake/"
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: "400px",
                      borderRadius: "20px",
                    }}
                  ></iframe>
                </TabPanel>
                <TabPanel value={3}>
                  <iframe
                    src="https://f3.silvergames.com/m/master-chess/"
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: "400px",
                      borderRadius: "20px",
                    }}
                  ></iframe>
                </TabPanel>
              </Tabs>
            </Box>
          </Box>
        </Layout.Main>
        <DisableRightClick />
      </Layout.Root>
    </CssVarsProvider>
  );
};

export default CourseDashboard;
