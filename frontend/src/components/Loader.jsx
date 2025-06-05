import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const Loader = ({ normalHeight, styles }) => {
  return (
    <Box
      component="div"
      sx={{
        minHeight: normalHeight ? "" : "100dvh",
        display: "grid",
        placeItems: "center",
        ...styles,
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loader;
