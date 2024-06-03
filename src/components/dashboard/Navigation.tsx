"use client";
import * as React from "react";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";
import Divider from "@mui/joy/Divider";
import Image from "next/image";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import SouthEastRoundedIcon from "@mui/icons-material/SouthEastRounded";
import MarkUnreadChatAltRoundedIcon from '@mui/icons-material/MarkUnreadChatAltRounded';

import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import AspectRatio from "@mui/joy/AspectRatio";

import axios from "axios";
import { useCookies } from "next-client-cookies";
import { APP_ROUTES } from "../Route";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathName = usePathname();
  const [books, setBooks] = React.useState([]);

  const getBooks = async () => {
    axios
      .get(APP_ROUTES.URL + "/library/withItems")
      .then(function (response) {
        const booksArray = response.data.filter((item) => item.id === 1)[0];
        setBooks(booksArray.items);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  React.useEffect(() => {
    getBooks();
  }, []);

  return (
    <>
      <List
        size="md"
        sx={{ "--ListItem-radius": "4px", "--List-gap": "4px", padding: 0 }}
      >
        <ListItem nested>
          <List
            aria-labelledby="nav-list-browse"
            sx={{
              "& .JoyListItemButton-root": { p: "8px" },
              marginTop: 0,
            }}
          >
            <a href="/dashboard" title="course">
              <ListItem>
                <ListItemButton selected={pathName === "/dashboard"}>
                  <ListItemDecorator>
                    <HomeRoundedIcon fontSize="large" />
                  </ListItemDecorator>
                  <ListItemContent>Главная</ListItemContent>
                </ListItemButton>
              </ListItem>
            </a>
            <a href="/dashboard/course" title="course">
              <ListItem>
                <ListItemButton selected={pathName === "/dashboard/course"}>
                  <ListItemDecorator>
                    <SchoolRoundedIcon fontSize="large" />
                  </ListItemDecorator>
                  <ListItemContent>Курс</ListItemContent>
                </ListItemButton>
              </ListItem>
            </a>
            <a href="/chat" title="profile">
              <ListItem>
                <ListItemButton selected={pathName === "/chat"}>
                  <ListItemDecorator>
                    <MarkUnreadChatAltRoundedIcon fontSize="medium" />
                  </ListItemDecorator>
                  <ListItemContent>Чат с куратором</ListItemContent>
                </ListItemButton>
              </ListItem>
            </a>
            <a href="/profile" title="profile">
              <ListItem>
                <ListItemButton selected={pathName === "/profile"}>
                  <ListItemDecorator>
                    <SettingsRoundedIcon fontSize="medium" />
                  </ListItemDecorator>
                  <ListItemContent>Настройки</ListItemContent>
                </ListItemButton>
              </ListItem>
            </a>
          </List>
        </ListItem>
      </List>
      <Divider className="beautyDivider" sx={{ margin: "15px 0" }} />
      <Typography
        level="title-md"
        sx={{ marginBottom: "15px", fontWeight: "500", color: "#4C6A55", }}
      >
        Книги:
      </Typography>
      {books.length > 0 &&
        books.map((book, index) => (
          <a
            href="http://proskill-academy.com/library"
            target="_blank"
            key={index}
            style={{ width: "100%" }}
            className="soldProductCard"
          >
            <Card
              className="beautyBlock"
              variant="outlined"
              invertedColors
              orientation="vertical"
              size="sm"
              sx={{ width: "100%", marginBottom: "15px", borderRadius: "20px" }}
            >
              <AspectRatio minHeight="120px" maxHeight="200px">
                <Image
                  src={APP_ROUTES.URL + "/" + book.photoUrl}
                  alt=""
                  loading="lazy"
                  width={300}
                  height={200}
                />
              </AspectRatio>
              <div>
                <Typography level="title-md" sx={{ fontSize: "14px" }}>
                  {book.title}
                </Typography>
                <Typography
                  level="body-sm"
                  sx={{ fontSize: "12px", marginTop: "5px" }}
                >
                  {book.author}
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
                    sx={{ color: "#4C6A55", fontWeight: "500" }}
                  >
                    Купить книгу
                  </Typography>
                  <SouthEastRoundedIcon
                    sx={{ color: "#4C6A55", width: "20px" }}
                  />
                </Box>
              </div>
            </Card>
          </a>
        ))}
    </>
  );
}
