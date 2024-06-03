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
import DialogContainer from "./DialogContainer";
import DialogPopup from "./DialogPopup";

import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";

import axios from "axios";
import { useCookies } from "next-client-cookies";
import { APP_ROUTES } from "./Route";
import { useRouter } from "next/navigation";

export default function CustomRightSideBar() {
  const cookies = useCookies();
  const access_token = cookies.get("access_token");
  const [editNote, setEditNote] = React.useState([]);
  const [openCreateNote, setOpenCreateNote] = React.useState(false);
  const [openUpdateNote, setOpenUpdateNote] = React.useState(false);
  const [notes, setNotes] = React.useState([]);
  const [mentorMessages, setMentorMessages] = React.useState([]);

  const getMentorMessages = async () => {
    axios
      .get(APP_ROUTES.URL + "/message")
      .then(function (response) {
        setMentorMessages(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
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
    getNotes();
    getMentorMessages();
  }, []);

  return (
    <Sheet
      className="sideSheet"
      sx={{
        display: { sm: "initial" },
        // borderLeft: "1px solid",
        borderColor: "neutral.outlinedBorder",
        height: "calc(100vh - 64px)",
        overflowY: "auto",
      }}
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
                  <FormLabel>Заголовок заметки</FormLabel>
                  <Input type="text" name="title" />
                </FormControl>

                <FormControl required>
                  <>Описание</>
                  <Textarea minRows={4} maxRows={15} name="description" />
                </FormControl>
                <Box>
                  <Button
                    type="submit"
                    fullWidth
                    sx={{
                      bgcolor: "#4C6A55",
                    }}
                  >
                    Сохранить
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
                  <FormLabel>Заголовок заметки</FormLabel>
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
                  <FormLabel>Описание</FormLabel>
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
                      bgcolor: "#4C6A55",
                    }}
                  >
                    Сохранить
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
          p: 2,
          display: "flex",
          alignItems: "center",
          overflowY: "auto",
          paddingLeft: { xs: "15px", sm: "0" },
        }}
        className="beautyBlock"
      >
        <Typography level="title-md" sx={{ flex: 1, color: "#4C6A55" }}>
          Полезные функции
        </Typography>
      </Box>
      <Tabs className="sideTabs">
        <TabList disableUnderline>
          <Tab indicatorInset sx={{ flexGrow: 1, borderRadius: "10px" }}>
            <Typography level="title-sm">Заметки</Typography>
          </Tab>
          <Tab indicatorInset sx={{ flexGrow: 1, borderRadius: "10px" }}>
            <Typography level="title-sm">Сообщения</Typography>
          </Tab>
        </TabList>
        <TabPanel
          value={0}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            paddingLeft: { xs: "15px", sm: "0" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography level="title-md" sx={{ color: "#4C6A55" }}>
                Ваши заметки
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
                  bgcolor: "#4C6A55",
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
                      sx={{
                        alignItems: "center",
                        fontWeight: 600,
                        color: "white",
                      }}
                    >
                      {note.title}
                    </Typography>{" "}
                    <Typography
                      level="title-sm"
                      sx={{
                        alignItems: "center",
                        overflowWrap: "anywhere",
                        color: "white",
                      }}
                    >
                      <span className="shortDescription">
                        {note.description}
                      </span>
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
                      <VisibilityIcon sx={{ color: "#afafaf" }} />
                    </IconButton>
                    <IconButton
                      component="span"
                      variant="plain"
                      color="neutral"
                      size="sm"
                      onClick={() => deleteNote(note.id)}
                    >
                      <DeleteRoundedIcon sx={{ color: "#afafaf" }} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            );
          })}
          {/* Заметки */}
        </TabPanel>
        <TabPanel
          value={1}
          sx={{
            pr: "10px",
            mt: "10px",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            paddingLeft: { xs: "10px", sm: "0" },
          }}
        >
          <AspectRatio ratio="21/9" sx={{ mb: "10px", borderRadius: "20px" }}>
            <Image
              alt=""
              width="400"
              height="200"
              src="https://www.gazeta.uz/media/img/2022/01/DhxJJ316424213436263_b.jpg"
              srcSet="https://www.gazeta.uz/media/img/2022/01/DhxJJ316424213436263_b.jpg 2x"
            />
          </AspectRatio>
          {mentorMessages.map((message, index) => {
            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  padding: "15px",
                  bgcolor: "#4C6A55",
                  borderRadius: "20px 20px 20px 0",
                  marginBottom: "10px",
                }}
              >
                <Typography
                  level="title-sm"
                  sx={{ color: "#fff", fontSize: "12px" }}
                >
                  {message.title}
                </Typography>
                <Typography level="body-sm" sx={{ color: "#fff" }}>
                  {message.description}
                </Typography>
                <Typography
                  level="body-sm"
                  sx={{ color: "#e6e6e6", fontSize: "10px" }}
                >
                  {message.createdAt.slice(0, 10)}
                </Typography>
              </Box>
            );
          })}
        </TabPanel>
      </Tabs>
    </Sheet>
  );
}
