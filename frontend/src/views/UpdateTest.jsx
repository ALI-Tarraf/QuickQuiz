import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import { useDispatch, useSelector } from "react-redux";
import {
  editTest,
  getTestInfo,
  testsOperationCompleted,
} from "../store/slices/tests/testsSlice";
import OperationAlert from "../components/OperationAlert";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Errorpage from "../components/ErrorPage";

const validationSchema = Yup.object().shape({
  testName: Yup.string().required("Test name is required"),
  testDuration: Yup.number().required("Test duration is required"),
  totalMark: Yup.number().required("Total mark is required"),
  testDate: Yup.date().required("Test Date is required"),
  testHour: Yup.string().required("TestHour is required"),
  questions: Yup.array()
    .of(
      Yup.object().shape({
        questionText: Yup.string().required("Please enter the question text"),
        options: Yup.array().of(Yup.string().required("Please enter option")),
        correctAnswer: Yup.string().required(
          "Please select the correct answer"
        ),
        questionScore: Yup.number()
          .typeError("Score must be a valid number")
          .required("Question Score is required"),
      })
    )
    .required("You should add at least one question")
    .min(1, "You should add at least one question")
    .test(
      "sum",
      "The sum of question scores must equal total mark",
      function (questions) {
        const { totalMark } = this.parent; // Access totalMark from the parent object
        const sumOfScores = questions.reduce(
          (sum, question) => sum + (question.questionScore || 0),
          0
        );
        return sumOfScores === totalMark; // Check if the sum equals totalMark
      }
    ),
});

function UpdateTest() {
  const [minTime, setMinTime] = useState("");
  const dispatch = useDispatch();
  const today = new Date().toLocaleDateString("en-CA");
  const { id } = useParams();

  const {
    status,
    message,
    error,
    isLoading,
    operationError,
    operationLoading,
    testInfo,
  } = useSelector((state) => state.tests);

  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      now.setHours(now.getHours());
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes() + 1).padStart(2, "0"); // Add 1 hour
      setMinTime(`${hours}:${minutes}`);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const now = new Date();
    now.setHours(now.getHours());
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes() + 1).padStart(2, "0"); // Add 1 minute
    setMinTime(`${hours}:${minutes}`);
    dispatch(getTestInfo(id));
  }, [id, dispatch]);

  useEffect(() => {
    setInitialValues(testInfo);
  }, [testInfo]);

  const submitHandler = (values) => {
    dispatch(editTest({ id, values }));
  };
  if (isLoading) return <Loader />;
  if (error) return <Errorpage />;
  return (
    <>
      <OperationAlert
        status={status}
        error={operationError}
        message={message}
        completedAction={testsOperationCompleted}
      />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnChange={false}
        onSubmit={submitHandler}
        enableReinitialize={true}
      >
        {({ values, setFieldValue, errors }) => (
          <Form>
            <Typography
              sx={{
                py: 2,
                fontWeight: "500",
                fontSize: {
                  xs: "2rem",
                  sm: "3rem",
                },
                textAlign: "center",
              }}
            >
              Update test
            </Typography>
            <Box
              component="div"
              sx={{
                minHeight: "100dvh",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                gap: "30px",
                margin: "8px",
              }}
            >
              <Box
                component="div"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  gap: {
                    xs: "20px",
                    sm: "15px",
                  },
                  margin: "8px",
                  width: {
                    xs: "80%",
                    sm: "80%",
                  },
                }}
              >
                <TextField
                  name={"testName"}
                  id={"testName"}
                  label="Test name"
                  onChange={(event) => {
                    setFieldValue("testName", event.target.value);
                  }}
                  value={values.testName || ""}
                  error={!!errors?.testName}
                  helperText={errors?.testName ? errors?.testName : ""}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "50%",
                    },
                  }}
                />

                <TextField
                  name={"testDuration"}
                  id={"testDuration"}
                  label="Duration (minutes)"
                  variant="outlined"
                  type="number"
                  onChange={(event) => {
                    setFieldValue("testDuration", event.target.value);
                  }}
                  value={values.testDuration || ""}
                  error={!!errors?.testDuration}
                  helperText={errors?.testDuration ? errors?.testDuration : ""}
                  InputProps={{
                    inputProps: {
                      min: 10,
                    },
                  }}
                />
                <TextField
                  name={"totalMark"}
                  id={"totalMark"}
                  label="Total Mark"
                  variant="outlined"
                  type="number"
                  onChange={(event) => {
                    setFieldValue("totalMark", event.target.value);
                  }}
                  value={values.totalMark || ""}
                  error={!!errors?.totalMark}
                  helperText={errors?.totalMark ? errors?.totalMark : ""}
                  InputProps={{
                    inputProps: {
                      min: 5,
                    },
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "30px",
                  paddingBottom: "50px",
                }}
              >
                <Box>
                  <InputLabel htmlFor="testDate" sx={{ pb: "5px" }}>
                    Test Date:
                  </InputLabel>
                  <TextField
                    name={"testDate"}
                    id={"testDate"}
                    variant="outlined"
                    type="date"
                    onChange={(event) => {
                      setFieldValue("testDate", event.target.value);
                    }}
                    value={values.testDate}
                    error={!!errors?.testDate}
                    helperText={errors?.testDate ? errors?.testDate : ""}
                    InputProps={{
                      inputProps: {
                        min: today, // ⛔️ Disallow past dates
                      },
                    }}
                  />
                </Box>
                <Box>
                  <InputLabel htmlFor="testHour" sx={{ pb: "5px" }}>
                    Test Hour:
                  </InputLabel>
                  <TextField
                    name={"testHour"}
                    id={"testHour"}
                    variant="outlined"
                    type="time"
                    onChange={(event) => {
                      setFieldValue("testHour", event.target.value);
                    }}
                    value={values.testHour}
                    inputProps={
                      values.testDate == new Date().toLocaleDateString("en-CA")
                        ? { min: minTime } // if true, apply min
                        : {}
                    }
                    error={!!errors?.testHour}
                    helperText={errors?.testHour ? errors?.testHour : ""}
                  />
                </Box>
              </Box>

              {values.questions?.map((question, index) => (
                <Stack
                  direction="column"
                  key={index}
                  sx={{
                    gap: "25px",
                    textAlign: "center",
                    minWidth: "80%",
                    paddingBottom: "45px",
                  }}
                >
                  <Box
                    component="div"
                    sx={{
                      display: "flex",
                      gap: { xs: "5px", sm: "15px" },
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      fontWeight={500}
                      sx={{
                        display: "flex",
                        gap: { xs: "2px", sm: "5px" },
                        fontSize: { xs: "17px", sm: "25px" },
                      }}
                    >
                      {index + 1} <span>-</span>
                    </Typography>

                    <TextField
                      name={`questions.${index}.questionText`}
                      id={`questions.${index}.questionText`}
                      label="Question test"
                      variant="filled"
                      onChange={(event) => {
                        setFieldValue(
                          `questions.${index}.questionText`,
                          event.target.value
                        );
                      }}
                      value={values.questions[index].questionText}
                      error={!!errors?.questions?.[index]?.questionText}
                      helperText={
                        errors?.questions?.[index]?.questionText
                          ? errors?.questions?.[index]?.questionText
                          : ""
                      }
                      sx={{ width: "100%" }}
                    />

                    <TextField
                      name={`questions.${index}.questionScore`}
                      id={`questions.${index}.questionScore`}
                      label=" Score"
                      variant="filled"
                      onChange={(event) => {
                        setFieldValue(
                          `questions.${index}.questionScore`,
                          event.target.value
                        );
                      }}
                      value={values.questions[index].questionScore}
                      error={!!errors?.questions?.[index]?.questionScore}
                      helperText={
                        errors?.questions?.[index]?.questionScore
                          ? errors?.questions?.[index]?.questionScore
                          : ""
                      }
                      sx={{ width: { xs: "22%", md: "14%" } }}
                    />
                  </Box>
                  <Stack direction="column" sx={{ gap: "10px" }}>
                    {question?.options?.map((option, i) => (
                      <Box component="div" key={i}>
                        <TextField
                          name={`questions.${index}.options.${i}`}
                          id={`questions.${index}.options.${i}`}
                          label={`option ${i + 1}`}
                          variant="outlined"
                          onChange={(event) => {
                            setFieldValue(
                              `questions.${index}.options.${i}`,
                              event.target.value
                            );
                          }}
                          value={values.questions[index].options[i]}
                          error={!!errors?.questions?.[index]?.options?.[i]}
                          helperText={
                            errors?.questions?.[index]?.options?.[i]
                              ? errors?.questions?.[index]?.options?.[i]
                              : ""
                          }
                          sx={{ width: "100%" }}
                          InputProps={{
                            sx: {
                              borderRadius: "15px",
                            },
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                  <Box component="div">
                    <FormControl
                      sx={{ width: "100%" }}
                      error={!!errors?.questions?.[index]?.correctAnswer}
                    >
                      <InputLabel id={`questions.${index}.correctAnswer`}>
                        Correct answer
                      </InputLabel>
                      <Select
                        name={`questions.${index}.correctAnswer`}
                        id={`questions.${index}.correctAnswer`}
                        label="Correct answer"
                        value={values.questions[index].correctAnswer}
                        onChange={(event) => {
                          setFieldValue(
                            `questions.${index}.correctAnswer`,
                            event.target.value
                          );
                        }}
                      >
                        {question.options?.map((option, i) => (
                          <MenuItem
                            key={i}
                            value={values.questions?.[index].options?.[i]}
                          >
                            {values.questions?.[index].options?.[i]}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        {errors?.questions?.[index]?.correctAnswer
                          ? errors?.questions?.[index]?.correctAnswer
                          : ""}
                      </FormHelperText>
                    </FormControl>
                  </Box>
                  <Stack direction="row" sx={{ gap: "10px" }}>
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={() => {
                        const newOptions = [...question.options, ""];
                        setFieldValue(`questions.${index}.options`, newOptions);
                      }}
                    >
                      Add option
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        if (question.options.length > 1) {
                          const newOptions = [...question.options.slice(0, -1)];
                          setFieldValue(
                            `questions.${index}.options`,
                            newOptions
                          );
                          setFieldValue(`questions.${index}.correctAnswer`, "");
                        }
                      }}
                    >
                      Remove option
                    </Button>
                  </Stack>

                  {/* <button
                    type="button"
                    onClick={() => {
                      const newQuestion = values.questions.filter(
                        (_, i) => i !== index
                        );
                      setFieldValue("questions", newQuestion);
                    }}
                  >
                    delete question
                  </button> */}
                </Stack>
              ))}
              <Stack direction="row" sx={{ gap: "10px" }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    const newOptions = [
                      ...values.questions,
                      {
                        questionText: "",
                        options: ["", "", "", ""],
                        correctAnswer: "",
                      },
                    ];
                    setFieldValue("questions", newOptions);
                  }}
                >
                  Add question
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    const newOptions = [...values.questions.slice(0, -1)];
                    setFieldValue("questions", newOptions);
                  }}
                >
                  Remove question
                </Button>
              </Stack>
              <Button
                type="submit"
                color="info"
                variant="contained"
                sx={{ mt: "20px" }}
                startIcon={
                  operationLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
                disabled={operationLoading ? true : false}
              >
                {operationLoading ? "publishing..." : "Publish changes"}
              </Button>
              {errors?.questions === "You should add at least one question" ||
              errors?.questions ===
                "The sum of question scores must equal total mark" ? (
                <Typography
                  sx={{
                    fontWeight: "400",
                    color: "white",
                    padding: "5px",
                    borderRadius: "10px",
                    display: "flex",
                    fontSize: "20px",
                    background: "red",
                  }}
                >
                  <WarningIcon />
                  <ErrorMessage name={`questions`} component="div" />
                </Typography>
              ) : (
                ""
              )}
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default UpdateTest;
