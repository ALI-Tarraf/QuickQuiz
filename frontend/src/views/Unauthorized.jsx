import { Box, Typography, Button } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  return (
    <Box
      sx={{
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 3,
      }}
    >
      <LockOutlinedIcon sx={{ fontSize: 80, color: "#d32f2f", mb: 2 }} />
      <Typography variant="h4" fontWeight="bold" mb={1}>
        Unauthorized
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        You do not have permission to view this page.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          user?.role === "admin"
            ? navigate("/admindashboard")
            : navigate("/testspage")
        }
        sx={{ borderRadius: 2, paddingX: 4 }}
      >
        Go Home
      </Button>
    </Box>
  );
};

export default Unauthorized;
