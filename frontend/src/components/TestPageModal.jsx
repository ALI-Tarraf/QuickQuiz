import { useState } from "react";
import { Modal, Box, Button, Typography, Stack } from "@mui/material";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import DoneIcon from "@mui/icons-material/Done";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "80%", md: "50%", lg: "30%" },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  py: 4,
  borderRadius: 2,
};

export default function TestPageModal({ result }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  const handleOpen = (type) => {
    setModalType(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setModalType("");
  };
  const handleExit = () => {
    navigate("/testresults", { replace: true });
  };
  const handleSubmit = () => {
    console.log(result);
    navigate("/testresults", { replace: true });
  };

  const getModalContent = () => {
    switch (modalType) {
      case "submit":
        return (
          <Box>
            <Typography sx={{ fontSize: { xs: "1rem", md: "1.5rem" } }}>
              Are you sure you want to submit your answers?
            </Typography>
            <Stack direction="row" sx={{ gap: "20px" }}>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  marginTop: "20px",
                  width: "50%",
                  p: "8px",
                  borderRadius: { xs: "5px", md: "8px" },
                }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
              <Button
                variant="outlined"
                color="error"
                sx={{
                  marginTop: "20px",
                  width: "50%",
                  p: "8px",
                  borderRadius: { xs: "5px", md: "8px" },
                }}
                onClick={handleClose}
              >
                CANCEL
              </Button>
            </Stack>
          </Box>
        );
      case "alert":
        return (
          <Box>
            <Typography sx={{ fontSize: { xs: "1rem", md: "1.5rem" } }}>
              You will only be marked for the questions you have chosen so far
            </Typography>
            <Stack direction="row" sx={{ gap: "20px" }}>
              <Button
                variant="contained"
                color="error"
                sx={{
                  marginTop: "20px",
                  width: "50%",
                  p: "8px",
                  borderRadius: { xs: "5px", md: "8px" },
                }}
                onClick={handleExit}
              >
                OK
              </Button>
              <Button
                variant="outlined"
                color="primary"
                sx={{
                  marginTop: "20px",
                  width: "50%",
                  p: "8px",
                  borderRadius: { xs: "5px", md: "8px" },
                }}
                onClick={handleClose}
              >
                CANCEL
              </Button>
            </Stack>
          </Box>
        );
      default:
        return "";
    }
  };

  return (
    <>
      <Stack direction="row" sx={{ gap: "20px" }}>
        <Button
          variant="contained"
          color="primary"
          sx={{
            marginTop: "20px",
            width: "50%",
            p: "13px",
            borderRadius: { xs: "5px", md: "8px" },
          }}
          onClick={() => handleOpen("submit")}
        >
          Submit
        </Button>
        <Button
          variant="outlined"
          color="error"
          sx={{
            marginTop: "20px",
            width: "50%",
            p: "13px",
            borderRadius: { xs: "5px", md: "8px" },
          }}
          onClick={() => handleOpen("alert")}
        >
          Exit
        </Button>
      </Stack>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {modalType === "submit" ? (
            <Stack direction={"row"} alignItems={"center"} gap={1} pb={1}>
              <DoneIcon
                color="success"
                sx={{ fontSize: { xs: "1.5rem", md: "2.5rem" } }}
              />
              <Typography
                sx={{
                  fontWeight: { xs: "500", md: "600" },
                  fontSize: { xs: "1.5rem", md: "2.5rem" },
                }}
              >
                Finish!
              </Typography>
            </Stack>
          ) : (
            <Stack direction={"row"} alignItems={"center"} gap={1} pb={1}>
              <ReportProblemOutlinedIcon
                sx={{ color: "red", fontSize: { xs: "1.5rem", md: "2.5rem" } }}
              />
              <Typography
                sx={{
                  fontWeight: { xs: "500", md: "600" },
                  fontSize: { xs: "1.5rem", md: "2.5rem" },
                }}
              >
                Warning
              </Typography>
            </Stack>
          )}

          {getModalContent()}
        </Box>
      </Modal>
    </>
  );
}
