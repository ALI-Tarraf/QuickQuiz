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
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import Timer from "../components/Timer";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TestPageModal from "../components/TestPageModal";
import { useDispatch, useSelector } from "react-redux";
import { getQuestions } from "../store/slices/tests/questionsSlice";
import Loader from "../components/Loader";
import Errorpage from "../components/ErrorPage";

function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
  }
  return shuffledArray;
}

const TestPage = () => {
  const { isLoading, error, questionsData } = useSelector(
    (state) => state.questions
  );

  const { id } = useParams();
  const [shuffled, setShuffled] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getQuestions(id));
    console.log(questionsData);
    setShuffled(
      shuffleArray(questionsData?.questions && questionsData?.questions)
    );
  }, [dispatch, id]);

  const [answers, setAnswers] = useState({});
  const result = shuffled.map((item, index) => ({
    questionId: +item.id,
    answerId: +answers[index] || null,
  }));

  const navigate = useNavigate();
  const handleTimeUp = () => {
    navigate("/testresults", { replace: true });
  };
  if (isLoading) return <Loader />;
  if (error) return <Errorpage />;

  return (
    <>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingX: {
            xs: "12px",
            sm: "40px",
          },
          borderBottom: "1px solid black",
          alignItems: "center",
          position: "sticky",
          top: 0,
          backgroundColor: "#272727",
          zIndex: 1000,
        }}
      >
        <NavLink
          replace
          to={"/testspage"}
          style={({ isActive }) => {
            return {
              borderRadius: isActive ? "5px" : "",
              background: isActive ? "rgba(255, 255, 255, 0.3)" : "",
            };
          }}
        >
          <Button
            sx={{
              color: "white",
              ":hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
            }}
          >
            <KeyboardBackspaceIcon sx={{ color: "white" }} fontSize="large" />
          </Button>
        </NavLink>
        <Typography
          sx={{
            color: "white",
            fontSize: {
              xs: "h5.fontSize",
              sm: "h4.fontSize",
            },
          }}
        >{`${questionsData.testName.toLocaleUpperCase()} TEST`}</Typography>

        <Timer duration={120} onTimeUp={handleTimeUp} />
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
        <TestPageModal result={result} />
      </Container>
    </>
  );
};

export default TestPage;
