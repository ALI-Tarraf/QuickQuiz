import { Box, Stack, Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

const Errorpage = ({ message }) => {
  return (
    <Box
      sx={{
        minHeight: "90dvh",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Stack
        spacing={2}
        sx={{
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "400px",
        }}
      >
        <ErrorIcon fontSize="large" sx={{ color: "error.main" }} />

        <Typography variant="h5" maxWidth="sm" textAlign="center">
          {message
            ? message
            : "Oops! There was an error, please try again later"}
        </Typography>
      </Stack>
    </Box>
  );
};

export default Errorpage;
