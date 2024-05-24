"use client";

import * as React from "react";
import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import GlobalStyles from "@mui/joy/GlobalStyles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Textarea from "@mui/joy/Textarea";
import Checkbox from "@mui/joy/Checkbox";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton, { IconButtonProps } from "@mui/joy/IconButton";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";

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

function ColorSchemeToggle(props: IconButtonProps) {
  const { onClick, ...other } = props;
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return (
    <IconButton
      aria-label="toggle light/dark mode"
      size="sm"
      variant="outlined"
      disabled={!mounted}
      onClick={(event) => {
        setMode(mode === "light" ? "dark" : "light");
        onClick?.(event);
      }}
      {...other}
    >
      {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
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
          "Ushbu telefon raqami yoki elektron pochta manziliga ega foydalanuvchi allaqachon mavjud!"
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
        alert("Tasdiqlash kodi noto'g'ri kiritildi!");
      });
  };

  return (
    <CssVarsProvider defaultMode="light" disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ":root": {
            "--Form-maxWidth": "800px",
            "--Transition-duration": "0.4s", // set to `none` to disable transition
          },
        }}
      />
      <Box
        sx={(theme) => ({
          width: { xs: "100%", md: "50vw" },
          transition: "width var(--Transition-duration)",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "flex-end",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255 255 255 / 0.2)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundColor: "rgba(19 19 24 / 0.4)",
          },
        })}
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
              <IconButton variant="soft" color="primary" size="sm">
                <BadgeRoundedIcon />
              </IconButton>
              <Typography level="title-lg">Pro-Skill</Typography>
            </Box>
            <ColorSchemeToggle />
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
              borderRadius: "sm",
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
                  Royxatan otish!
                </Typography>
                <Typography level="body-sm">
                  Hisob allaqachon bormi?{" "}
                  <Link href="/" level="title-sm">
                    Kirish!
                  </Link>
                </Typography>
              </Stack>
            </Stack>
            <Divider
              className="beautyDivider"
              sx={(theme) => ({
                [theme.getColorSchemeSelector("light")]: {
                  color: { xs: "#000", md: "yoki" },
                },
              })}
            >
              yoki
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
                    <FormLabel>Telefon raqami</FormLabel>
                    <Input
                      type="tel"
                      name="phoneNumber"
                      placeholder="+998 -- --- -- --"
                    />
                  </FormControl>
                  <FormControl required>
                    <FormLabel>Shahar</FormLabel>
                    <Input type="text" name="city" />
                  </FormControl>
                  <FormControl required>
                    <FormLabel>Tug'ilgan sana</FormLabel>
                    <Input type="date" name="birthday" />
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
                    </Box>
                    <Button type="submit" loading={isLoading} fullWidth>
                      Ro'yxatdan o'tish
                    </Button>
                  </Stack>
                </form>
              )}

              {isOpenCheckPassword && (
                <form onSubmit={(e) => handleCheckPassword(e)}>
                  <Typography level="body-sm">
                    Tasdiqlash kodi elektron xatga yuborildi{" "}
                    <b>+998903500137</b>
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    <FormControl required>
                      <FormLabel>Tasdiqlash kodi</FormLabel>
                      <Input type="text" name="checkPass" />
                    </FormControl>
                    <Box>
                      <Button type="submit" loading={isLoading} fullWidth>
                        Saqlash
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
        sx={(theme) => ({
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
            "url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundImage:
              "url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)",
          },
        })}
      />
    </CssVarsProvider>
  );
}