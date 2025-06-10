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
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import TestPageModal from "../components/TestPageModal";
const questionsData = {
  testName: "java",
  questions: [
    {
      question: "What is your favorite color?",
      options: ["Red", "Blue", "Green", "Yellow"],
      score: "10",
    },
    {
      question: "What is your favorite animal?",
      options: ["Dog", "Cat", "Bird", "Fish"],
      score: "15",
    },
    {
      question:
        "What is your favorite food What is your favorite foodWhat is your favorite foodWhat is your favorite foodWhat is your favorite foodWhat is your favorite foodWhat is your favorite foodWhat is your favorite foodWhat is your favorite food?",
      options: ["Pizza", "Burger", "Pasta", "Salad"],
      score: "1",
    },
    {
      question:
        "What is your favorite food What is your favorite foodWhat is your favorite foodWhat is your favorite foodWhat is your favorite foodWhat is your favorite foodWhat is your favorite foodWhat is your favorite foodWhat is your favorite food?",
      options: ["Pizza", "Burger", "Pasta", "Salad"],
      score: "13",
    },
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      score: "20",
    },
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      score: "25",
    },
    {
      question: "What is the largest planet in our solar system?",
      options: ["Earth", "Jupiter", "Mars", "Saturn"],
      score: "5",
    },
  ],
};

function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
  }
  return shuffledArray;
}

const shuffled = shuffleArray(questionsData.questions);

const TestPage = () => {
  const [answers, setAnswers] = useState({});
  const result = shuffled.map((item, index) => ({
    question: item.question,
    selectedOption: answers[index] || null, // or "" if you prefer
  }));
  // const handleSubmit = () => {
  //   console.log(result); // or send to server via fetch / axios
  // };
  const navigate = useNavigate();
  const handleTimeUp = () => {
    navigate("/testresults", { replace: true });
  };

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
                {item.question}
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
                  {item.score} pts
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
                  value={option}
                  control={<Radio />}
                  label={
                    <Typography variant="body1" sx={{ fontWeight: "400" }}>
                      {option}
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
