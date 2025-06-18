import { Box, Stack, Typography } from "@mui/material";
import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded";
const NoResultsPage = ({ message }) => {
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
        <SentimentDissatisfiedRoundedIcon
          fontSize="large"
          sx={{ color: "gray" }}
        />

        <Typography
          variant="h5"
          maxWidth="sm"
          textAlign="center"
          sx={{ color: "gray" }}
        >
          {message ? message : "There are no results yet"}
        </Typography>
      </Stack>
    </Box>
  );
};

export default NoResultsPage;
