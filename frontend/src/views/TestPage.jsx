import {
  Container,
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Stack,
  Box,
  Modal,
  CircularProgress,
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import Timer from "../components/Timer";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TestPageModal from "../components/TestPageModal";
import { useDispatch, useSelector } from "react-redux";
import {
  getQuestions,
  questionsOperationCompleted,
  submitAnswers,
} from "../store/slices/tests/questionsSlice";
import Loader from "../components/Loader";
import Errorpage from "../components/ErrorPage";
import OperationAlert from "../components/OperationAlert";

function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
  }
  return shuffledArray;
}

const TestPage = () => {
  const {
    isLoading,
    error,
    questionsData,
    status,
    message,
    submitError,
    submitIsLoading,
  } = useSelector((state) => state.questions);

  const { id } = useParams();
  const [shuffled, setShuffled] = useState([]);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState({});
  console.log(shuffled);
  const result = shuffled.map((item, index) => ({
    questionId: +item.id,
    answerId: +answers[index] || null,
  }));

  const navigate = useNavigate();

  const handleTimeUp = () => {
    dispatch(submitAnswers({ id, result }));
    navigate("/testresults", { replace: true });
    sessionStorage.clear();
  };
  const handleExit = () => {
    dispatch(submitAnswers({ id }));
    navigate("/testresults", { replace: true });
    sessionStorage.clear();
  };

  useEffect(() => {
    dispatch(getQuestions(id));

    setShuffled(
      shuffleArray(questionsData?.questions && questionsData?.questions)
    );
  }, [dispatch, id]);
  useEffect(() => {
    if (questionsData?.questions?.length > 0) {
      const shuffledData = shuffleArray(questionsData?.questions);
      setShuffled(shuffleArray(shuffledData));
    }
  }, [questionsData]);

  if (isLoading) return <Loader />;
  if (error) return <Errorpage />;

  return (
    <>
      <OperationAlert
        status={status}
        error={submitError}
        message={message}
        completedAction={questionsOperationCompleted}
      />
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingX: {
            xs: "5px",
            sm: "40px",
          },
          borderBottom: "1px solid black",
          alignItems: "center",
          position: "sticky",
          top: 0,
          backgroundColor: "#272727",
          zIndex: 1000,
          gap: 2,
        }}
      >
        <Button
          sx={{
            color: "white",
            ":hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
          }}
          onClick={() => setOpen(true)}
        >
          <KeyboardBackspaceIcon sx={{ color: "white" }} fontSize="large" />
        </Button>

        <Typography
          sx={{
            color: "white",
            textAlign: "center",
            fontSize: {
              xs: "h6.fontSize",
              sm: "h4.fontSize",
            },
          }}
        >{`${questionsData.testName.toLocaleUpperCase()} TEST`}</Typography>
        {questionsData?.testDuration && (
          <Timer
            duration={questionsData?.testDuration}
            onTimeUp={handleTimeUp}
          />
        )}
      </Stack>
      <Container sx={{ marginTop: "30px", marginBottom: "20px" }}>
        {shuffled?.map((item, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{ marginBottom: "20px", padding: "20px" }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" gutterBottom>
                {item.question}?
              </Typography>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  paddingLeft: "15px",
                }}
              >
                <Box
                  sx={{
                    ml: 2,
                    px: 1.5,
                    py: 0.5,
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                    borderRadius: "12px",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    boxShadow: 1,
                    textAlign: "center",
                  }}
                >
                  {item.mark} pts
                </Box>
              </Typography>
            </Box>

            <RadioGroup
              value={answers[index] || ""}
              onChange={(e) => {
                setAnswers((prev) => ({ ...prev, [index]: e.target.value }));
              }}
            >
              {item.options.map((option, idx) => (
                <FormControlLabel
                  key={idx}
                  value={option.id}
                  control={<Radio />}
                  label={
                    <Typography variant="body1" sx={{ fontWeight: "400" }}>
                      {option.text}
                    </Typography>
                  }
                />
              ))}
            </RadioGroup>
          </Paper>
        ))}
        <TestPageModal result={result} id={id} />
      </Container>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
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
          }}
        >
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
                onClick={() => setOpen(false)}
              >
                CANCEL
              </Button>
            </Stack>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default TestPage;
