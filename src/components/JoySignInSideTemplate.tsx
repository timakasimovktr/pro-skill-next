"use client";

import * as React from "react";
import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import { IMaskInput } from "react-imask";
import GlobalStyles from "@mui/joy/GlobalStyles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Checkbox from "@mui/joy/Checkbox";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Image from "next/image";
import CourseImage from "../images/course.jpg";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
import { useCookies } from "next-client-cookies";
import { APP_ROUTES } from "./Route";
import { useRouter } from "next/navigation";
import { FormatListBulletedTwoTone } from "@mui/icons-material";

interface FormElements extends HTMLFormControlsCollection {
  phoneNum: HTMLInputElement;
  password: HTMLInputElement;
  persistent: HTMLInputElement;
}
interface SignInFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function JoySignInSideTemplate() {
  const phoneMask = "+998 (00) 000-00-00";
  const cookies = useCookies();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpenChangePassword, setIsOpenChangePassword] = React.useState(false);
  const [isOpenSendPassword, setIsOpenSendPassword] = React.useState(true);
  const [phoneNum, setPhoneNum] = React.useState("");

  const Mask = [
    {
      mask: phoneMask,
    },
  ];

  const signIn = (event) => {
    event.preventDefault();
    setIsLoading(true);
    const formElements = event.currentTarget.elements;
    const data = {
      phoneNumber: formElements.phoneNum.value.replace(/[()\-\s]/g, ""),
      password: formElements.password.value,
    };

    axios
      .post(APP_ROUTES.URL + "/auth/login", data)
      .then((res) => {
        cookies.set("access_token", res.data.access_token, {
          expires: 1,
        });
        cookies.set("userId", res.data.userId, {
          expires: 1,
        });

        router.push("/dashboard");
      })
      .catch((err) => {
        toast.error("Notog`ri telefon raqami yoki parol!");
        setIsLoading(false);
      });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSendPassword = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPhoneNum(e.currentTarget.elements.resetPhone.value);
    axios
      .post(APP_ROUTES.URL + "/auth/send-phone-code", {
        phoneNumber: e.currentTarget.elements.resetPhone.value,
      })
      .then((res) => {
        setIsOpenSendPassword(false);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error("Номер телефона введен не правильно!");
        setIsLoading(false);
      });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post(APP_ROUTES.URL + "/auth/change-password", {
        phoneNumber: phoneNum,
        newPassword: e.currentTarget.elements.newPass.value,
        code: e.currentTarget.elements.checkPass.value,
      })
      .then((res) => {
        setIsOpenChangePassword(false);
        setIsOpenSendPassword(true);
        setIsLoading(false);
        toast.success("Пароль успешно изменен!");
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error("Код подтверждения введен неправильно!");
      });
  };

  return (
    <CssVarsProvider defaultMode="light">
      <CssBaseline />
      <ToastContainer />
      <GlobalStyles
        styles={{
          ":root": {
            "--Form-maxWidth": "800px",
            "--Transition-duration": "0.4s", // set to `none` to disable transition
          },
        }}
      />
      <Box
        className="poppins"
        sx={{
          width: { xs: "100%", md: "50vw" },
          transition: "width var(--Transition-duration)",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "flex-end",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgb(255 255 255 / 72%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100dvh",
            width: "100%",
            px: 2,
          }}
        >
          <Box
            component="header"
            sx={{
              py: 3,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
              <Image
                src="https://proskill-academy.com/static/media/proskillLogo2.72ec72931c123705368a45e8403689a9.svg"
                alt="logo"
                width={70}
                height={70}
              />
            </Box>
          </Box>
          <Box
            component="main"
            sx={{
              my: "auto",
              py: 2,
              pb: 5,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: 400,
              maxWidth: "100%",
              mx: "auto",
              borderRadius: "md",
              "& form": {
                display: "flex",
                flexDirection: "column",
                gap: 2,
              },
              [`& .MuiFormLabel-asterisk`]: {
                visibility: "hidden",
              },
            }}
          >
            <Stack gap={4} sx={{ mb: 2 }}>
              <Stack gap={1}>
                <Typography component="h1" level="h3">
                  Platformaga kirish!
                </Typography>
                <Typography level="body-sm">
                  Yangi foydalanuvchi?{" "}
                  <Link href="/registration" level="title-sm">
                    Royxatdan otish!
                  </Link>
                </Typography>
              </Stack>
            </Stack>
            <Divider
              sx={{
                color: { xs: "#000", md: "или" },
              }}
            >
              или
            </Divider>
            <Stack gap={4} sx={{ mt: 2 }}>
              {!isOpenChangePassword && (
                <form
                  onSubmit={(event: React.FormEvent<SignInFormElement>) => {
                    signIn(event);
                  }}
                >
                  <FormControl required>
                    <FormLabel>Telefon raqami</FormLabel>
                    <div className="MuiInputPhone">
                      <IMaskInput
                        className="MuiInput-input css-1gw9vc6-JoyInput-input"
                        mask={Mask}
                        type="tel"
                        name="phoneNum"
                      />
                    </div>
                  </FormControl>
                  <FormControl required>
                    <FormLabel>Parol</FormLabel>
                    <Input type="password" name="password" />
                  </FormControl>
                  <Stack gap={4} sx={{ mt: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Checkbox
                        size="sm"
                        label="Meni eslang"
                        name="persistent"
                      />
                      <Link
                        level="title-sm"
                        onClick={() => setIsOpenChangePassword(true)}
                        sx={{ color: "#4C6A55" }}
                      >
                         Parolni unutdingizmi?
                      </Link>
                    </Box>
                    <Button
                      type="submit"
                      loading={isLoading}
                      fullWidth
                      sx={{
                        bgcolor: "#4C6A55",
                        "&:hover": {
                          bgcolor: "#364b3d",
                        },
                      }}
                    >
                      Kirish
                    </Button>
                  </Stack>
                </form>
              )}

              {isOpenChangePassword && (
                <>
                  {isOpenSendPassword ? (
                    <form onSubmit={(e) => handleSendPassword(e)}>
                      <Typography level="body-sm">Сброс пароля</Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "15px",
                        }}
                      >
                        <FormControl required>
                          <FormLabel>Номер телефона</FormLabel>
                          <Input type="tel" name="resetPhone" />
                        </FormControl>
                        <Box>
                          <Button
                            type="submit"
                            loading={isLoading}
                            fullWidth
                            sx={{
                              bgcolor: "#4C6A55",
                              "&:hover": {
                                bgcolor: "#364b3d",
                              },
                            }}
                          >
                            Отправить
                          </Button>
                        </Box>
                      </Box>
                    </form>
                  ) : (
                    <form onSubmit={(e) => handleChangePassword(e)}>
                      <Typography level="body-sm">
                        Код подтверждения отправлен на номер телефона -{" "}
                        <b>{phoneNum}</b>
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "15px",
                        }}
                      >
                        <FormControl sx={{ display: "none" }}>
                          <FormLabel>Старый пароль</FormLabel>
                          <Input type="text" name="oldPass" />
                        </FormControl>
                        <FormControl required>
                          <FormLabel>Новый пароль</FormLabel>
                          <Input type="text" name="newPass" />
                        </FormControl>
                        <FormControl required>
                          <FormLabel>Код подтверждения</FormLabel>
                          <Input type="text" name="checkPass" />
                        </FormControl>
                        <Box>
                          <Button
                            type="submit"
                            loading={isLoading}
                            fullWidth
                            sx={{
                              bgcolor: "#4C6A55",
                              "&:hover": {
                                bgcolor: "#364b3d",
                              },
                            }}
                          >
                            Отправить
                          </Button>
                        </Box>
                      </Box>
                    </form>
                  )}
                </>
              )}
            </Stack>
          </Box>
          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" textAlign="center">
              © Phoenix {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          height: "100%",
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          left: { xs: 0, md: "50vw" },
          transition:
            "background-image var(--Transition-duration), left var(--Transition-duration) !important",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          backgroundColor: "background.level1",
          backgroundSize: "cover",
          backgroundPosition: "bottom",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${CourseImage.src})`,
        }}
      />
    </CssVarsProvider>
  );
}
