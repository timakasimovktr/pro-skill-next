"use client";
import * as React from "react";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import AvatarWithStatus from "./AvatarWithStatus";
import ChatBubble from "./ChatBubble";
import MessageInput from "./MessageInput";
import MessagesPaneHeader from "./MessagesPaneHeader";
import { ChatProps, MessageProps } from "../types";
import { APP_ROUTES } from "../Route";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import io from "socket.io-client";

export default function MessagesPane() {
  const router = useRouter();
  const cookies = useCookies();
  const [textAreaValue, setTextAreaValue] = React.useState("");
  const [userMessages, setUserMessages] = React.useState([]);

  const socket = io("http://213.230.71.82:5000", {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: `Bearer ${cookies.get("access_token")}`,
        },
      },
    },
  });

  const getUserMessages = async () => {
    try {
      const { data } = await axios.get(APP_ROUTES.URL + "/chat/user", {
        headers: {
          Authorization: `Bearer ${cookies.get("access_token")}`,
        },
      });
      setUserMessages(data);
    } catch (error) {
      router.push("/");
    }
  };

  socket.on("message", (data) => {
    getUserMessages();
  });

  React.useEffect(() => {
    getUserMessages();

    return () => {
      socket.off('message');
      socket.disconnect();
    };
  }, []);

  return (
    <Sheet
      sx={{
        borderRadius: '15px',
        height: { xs: "calc(100vh - 94px)" },
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#8EA488",
        border: "1px solid #32383e40",
      }}
    >
      <MessagesPaneHeader />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          px: 2,
          py: 3,
          overflowY: "scroll",
          flexDirection: "column-reverse",
        }}
      >
        <Stack spacing={2} justifyContent="flex-end">
          {userMessages.map((message, index) => {
            const isYou = !message.fromMentor;
            return (
              <Stack
                key={index}
                direction="row"
                spacing={2}
                flexDirection={isYou ? "row-reverse" : "row"}
              >
                {message.fromMentor !== "false" && (
                  <AvatarWithStatus
                    online
                    src="https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
                  />
                )}
                <ChatBubble
                  variant={isYou ? "sent" : "received"}
                  sender={isYou ? "Вы" : "Куратор"}
                  content={message.message}
                  {...message}
                />
              </Stack>
            );
          })}
        </Stack>
      </Box>
      <MessageInput
        textAreaValue={textAreaValue}
        setTextAreaValue={setTextAreaValue}
        onSubmit={() => {
          socket.emit("message", { text: textAreaValue });
          setTextAreaValue("");
          getUserMessages();
        }}
      />
    </Sheet>
  );
}
