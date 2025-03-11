import { Box, Button, Stack, Typography } from "@cgi-learning-hub/ui";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { WarningSVG } from "../svg/warning";
import { PageErrorProps } from "./types";

export const PageError: FC<PageErrorProps> = ({ isNotFoundError = false }) => {
  const navigate = useNavigate();

  const handleGoToHome = () => {
    navigate("/");
  };

  return (
    <Stack
      height="100vh"
      justifyContent="center"
      alignItems="center"
      spacing="2rem"
    >
      <Box width="25rem">
        <WarningSVG />
      </Box>
      <Typography variant="body1" color="error" fontSize="2.4rem">
        {"Oups !"}
      </Typography>
      <Typography variant="body2" fontSize="1.6rem">
        {isNotFoundError ? "La page n’existe pas." : "Un erreur est survenue."}
      </Typography>
      <Button
        variant="contained"
        sx={{ fontSize: "1.6rem" }}
        onClick={handleGoToHome}
      >
        {"Retour à l'accueil"}
      </Button>
    </Stack>
  );
};
