import { useState } from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import DoneIcon from "@mui/icons-material/Done";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
import {
  questionsOperationCompleted,
  submitAnswers,
} from "../store/slices/tests/questionsSlice";
import OperationAlert from "./OperationAlert";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", md: "50%", lg: "30%" },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  py: 4,
  borderRadius: 2,
};

export default function TestPageModal({ result, id }) {
  const { status, message, submitError, submitIsLoading } = useSelector(
    (state) => state.questions
  );
  const dispatch = useDispatch();
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
    dispatch(submitAnswers({ id }));
    navigate("/testresults", { replace: true });
    sessionStorage.clear();
  };
  const handleSubmit = () => {
    dispatch(submitAnswers({ id, result }));
    navigate("/testresults", { replace: true });
    sessionStorage.clear();
  };

  const getModalContent = () => {
    switch (modalType) {
      case "submit":
        return (
          <>
            <Box>
              <Typography sx={{ fontSize: { xs: "1rem", md: "1.3rem" } }}>
                Are you sure you want to submit your answers because you will
                only be marked for the questions you have chosen so far?
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
                  startIcon={
                    submitIsLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SendIcon />
                    )
                  }
                  disabled={submitIsLoading ? true : false}
                >
                  {submitIsLoading ? "Submiting..." : "Submit"}
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
          </>
        );
      case "alert":
        return (
          <Box>
            <Typography sx={{ fontSize: { xs: "1rem", md: "1.5rem" } }}>
              You will take 0 if you exit without submit your answers!
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
                disabled={submitIsLoading ? true : false}
              >
                {submitIsLoading ? <CircularProgress /> : "OK"}
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
      <OperationAlert
        status={status}
        error={submitError}
        message={message}
        completedAction={questionsOperationCompleted}
      />
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
          startIcon={<SendIcon />}
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
                  fontSize: { xs: "1.5rem", md: "2rem" },
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
                  fontSize: { xs: "1.5rem", md: "2rem" },
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
