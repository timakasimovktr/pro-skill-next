"use client";
import * as React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";

import Input from "@mui/joy/Input";
import Textarea from "@mui/joy/Textarea";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";

import DialogContainer from "../DialogContainer";
import DialogPopup from "../DialogPopup";

import axios from "axios";
import { useCookies } from "next-client-cookies";
import { APP_ROUTES } from "../Route";
import { useRouter } from "next/navigation";

const CheckPass = () => {
  return (
    <DialogContainer onClose={() => false}>
      <DialogPopup onClose={(e) => e.stopPropagation()}>
        <form onSubmit={(e) => e}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <FormControl required>
              <FormLabel>Tavsif</FormLabel>
              <Textarea minRows={4} name="description" />
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
  );
};

export default CheckPass;
