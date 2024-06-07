"use client";

import * as React from "react";
import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
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

import axios from "axios";
import { useCookies } from "next-client-cookies";
import { APP_ROUTES } from "./Route";
import { useRouter } from "next/navigation";

interface FormElements extends HTMLFormControlsCollection {
  fullName: HTMLInputElement;
  email: HTMLInputElement;
  phoneNumber: HTMLInputElement;
  city: HTMLInputElement;
  birthday: HTMLInputElement;
  password: HTMLInputElement;
}
interface SignInFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function JoySignUpSideTemplate() {
  const cookies = useCookies();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpenCheckPassword, setIsOpenCheckPassword] = React.useState(false);
  const [registrationData, setRegistrationData] = React.useState({} as any);

  const handleRagistration = (event) => {
    const formElements = event.currentTarget.elements;
    const data = {
      fullName: formElements.fullName.value,
      email: formElements.email.value,
      phoneNumber: formElements.phoneNumber.value,
      gender: "",
      city: formElements.city.value,
      birthday: formElements.birthday.value,
      password: formElements.password.value,
    };
    setRegistrationData(data);
    axios
      .post(APP_ROUTES.URL + "/auth/register", data)
      .then((res) => {
        setIsLoading(false);
        setIsOpenCheckPassword(true);
      })
      .catch((err) => {
        alert(
          "Пользователь с этим номером телефона или адресом электронной почты уже существует!"
        );
        setIsLoading(false);
      });
  };

  const handleCheckPassword = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post(APP_ROUTES.URL + "/auth/verify-phone-code", {
        phoneNumber: registrationData.phoneNumber,
        code: e.target.checkPass.value,
      })
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
        alert("Код подтверждения введен неправильно!");
      });
  };

  return (
    <CssVarsProvider defaultMode="light">
      <CssBaseline />
      <GlobalStyles
        styles={{
          ":root": {
            "--Form-maxWidth": "800px",
            "--Transition-duration": "0.4s",
          },
        }}
      />
      <Box
        sx={{
          width: { xs: "100%", md: "50vw" },
          transition: "width var(--Transition-duration)",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "flex-end",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255 255 255 / 0.2)",
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
                  Зарегистрироваться!
                </Typography>
                <Typography level="body-sm">
                  Уже есть аккаунт?{" "}
                  <Link href="/" level="title-sm">
                    Вход!
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
              {!isOpenCheckPassword && (
                <form
                  onSubmit={(event: React.FormEvent<SignInFormElement>) => {
                    event.preventDefault();
                    setIsLoading(true);

                    handleRagistration(event);
                  }}
                >
                  <FormControl required>
                    <FormLabel>Ф.И.О</FormLabel>
                    <Input type="text" name="fullName" />
                  </FormControl>
                  <FormControl required>
                    <FormLabel>E-mail</FormLabel>
                    <Input type="email" name="email" />
                  </FormControl>
                  <FormControl required>
                    <FormLabel>Номер телефона</FormLabel>
                    <Input
                      type="tel"
                      name="phoneNumber"
                      placeholder="+998 -- --- -- --"
                    />
                  </FormControl>
                  <FormControl required>
                    <FormLabel>Город</FormLabel>
                    <Input type="text" name="city" />
                  </FormControl>
                  <FormControl required>
                    <FormLabel>Дата рождения</FormLabel>
                    <Input type="date" name="birthday" />
                  </FormControl>
                  <FormControl required>
                    <FormLabel>Пароль</FormLabel>
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
                        label="запомнить меня"
                        name="persistent"
                      />
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
                      Зарегистрироваться
                    </Button>
                  </Stack>
                </form>
              )}

              {isOpenCheckPassword && (
                <form onSubmit={(e) => handleCheckPassword(e)}>
                  <Typography level="body-sm">
                    Код подтверждения отправлен на номер телефона -{" "}
                    <b>{registrationData.phoneNumber}</b>
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
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
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage:
            "url(https://proskill-academy.com/static/media/course2.cae228c2a2aead76de18.jpg)",
        }}
      />
    </CssVarsProvider>
  );
}
