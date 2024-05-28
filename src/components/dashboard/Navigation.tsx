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
import Image from 'next/image';

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import SouthEastRoundedIcon from "@mui/icons-material/SouthEastRounded";

import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import AspectRatio from "@mui/joy/AspectRatio";

import axios from "axios";
import { useCookies } from "next-client-cookies";
import { APP_ROUTES } from "../Route";
import { useRouter } from "next/navigation";

export default function Navigation() {
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
            <ListItem>
              <ListItemButton selected className="selectedListItem">
                <ListItemDecorator>
                  <HomeRoundedIcon fontSize="large" />
                </ListItemDecorator>
                <ListItemContent>Assosiy</ListItemContent>
              </ListItemButton>
            </ListItem>
            <a href="/dashboard/course" title="course">
            <ListItem>
              <ListItemButton>
                <ListItemDecorator>
                  <SchoolRoundedIcon fontSize="large" />
                </ListItemDecorator>
                <ListItemContent>Kurs</ListItemContent>
              </ListItemButton>
            </ListItem>
            </a>
            {/* <ListItem>
              <ListItemButton>
                <ListItemDecorator>
                  <MessageRoundedIcon fontSize="large" />
                </ListItemDecorator>
                <ListItemContent>Xabarlar</ListItemContent>
              </ListItemButton>
            </ListItem> */}
            {/* <ListItem>
              <ListItemButton>
                <ListItemDecorator>
                  <SettingsRoundedIcon fontSize="medium" />
                </ListItemDecorator>
                <ListItemContent>Sozlama</ListItemContent>
              </ListItemButton>
            </ListItem> */}
          </List>
        </ListItem>
      </List>
      <Divider className="beautyDivider" sx={{ margin: "15px 0" }} />
      <Typography
        level="title-md"
        sx={{ marginBottom: "15px", fontWeight: "500" }}
      >
        Kitoblar:
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
              color="success"
              variant="outlined"
              invertedColors
              orientation="vertical"
              size="sm"
              sx={{ width: "100%", marginBottom: "15px" }}
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
                <Typography level="title-md">{book.title}</Typography>
                <Typography level="body-sm">{book.author}</Typography>
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
                    Китоб сотиб олинг
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
  );
}
