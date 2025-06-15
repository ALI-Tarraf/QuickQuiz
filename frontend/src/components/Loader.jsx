import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const Loader = () => {
  return (
    <Box
      component="div"
      sx={{
        minHeight: "87dvh",
        display: "grid",
        placeItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loader;
