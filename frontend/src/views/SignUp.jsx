import { useEffect, useState } from "react";

import { Form, Formik } from "formik";
import * as yup from "yup";
import backgroundImage from "../assets/intro1.jpg";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { register } from "../store/slices/auth/authSlice";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const loginSchema = yup.object().shape({
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password is too short - should be 8 chars minimum.")
      .matches(/[a-z]/, "Password must contain at least 1 lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least 1 uppercase letter")
      .matches(/[0-9]/, "Password must contain at least 1 number"),
    confirm_password: yup
      .string()
      .required("Confirm password is required")
      .test("confirm-password", "Password does not match", function (value) {
        const { password } = this.parent;
        return value === password;
      }),
    is_teacher: yup.boolean(),
    spec: yup.string().when("is_teacher", {
      is: true,
      then: (schema) => schema.required("Specialization is required"),
    }),
  });

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    is_teacher: false,
    spec: "",
  };
  const submitHandler = (values) => {
    delete values["confirm_password"];
    if (!values.is_teacher) {
      delete values["spec"];
      console.log({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
        role: "student",
      });
      dispatch(
        register({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          password: values.password,
          role: "student",
        })
      );
    } else {
      console.log({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
        role: "teacher",
        specialization: values.spec,
      });
      dispatch(
        register({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          password: values.password,
          role: "teacher",
          specialization: values.spec,
        })
      );
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <>
      <Box
        component="div"
        sx={{
          minHeight: "100dvh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Typography
          color="#F0F8FF"
          paddingBottom={6}
          sx={{
            fontWeight: "600",
            fontSize: {
              xs: "h3.fontSize",
              sm: "h2.fontSize",
            },
          }}
        >
          Quick Quiz
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          validateOnChange={false}
          onSubmit={submitHandler}
        >
          {(props) => (
            <Box sx={{ padding: "1rem" }}>
              <Form>
                <Box
                  component="div"
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    minWidth: { xs: "100%", sm: "400px" },
                    minHeight: "400px",
                    padding: "2rem",
                    bgcolor: "rgba(240, 248, 255, 0.8)",
                    borderRadius: 7,
                  }}
                >
                  <Typography variant="h6" sx={{ textAlign: "center", mb: 4 }}>
                    Create an account
                  </Typography>

                  <Stack direction="column" spacing={3.5}>
                    <Stack direction="row" spacing={1}>
                      <TextField
                        name="first_name"
                        id="first_name"
                        label="First name"
                        variant="standard"
                        onChange={(event) => {
                          props.values.first_name = event.target.value;
                        }}
                        error={!!props.errors.first_name}
                        helperText={
                          props.errors.first_name ? props.errors.first_name : ""
                        }
                      />
                      <TextField
                        name="last_name"
                        id="last_name"
                        label="Last name"
                        variant="standard"
                        onChange={(event) => {
                          props.values.last_name = event.target.value;
                        }}
                        error={!!props.errors.last_name}
                        helperText={
                          props.errors.last_name ? props.errors.last_name : ""
                        }
                      />
                    </Stack>

                    <Stack direction={"row"} spacing={3}>
                      <Typography pt={1} sx={{ textDecoration: "underline" }}>
                        Are you a teacher?
                      </Typography>
                      <Checkbox
                        name="is_teacher"
                        checked={props.values.is_teacher}
                        onChange={(event) => {
                          const { checked } = event.target;
                          props.setFieldValue("is_teacher", checked);
                          // Reset spec if unchecked
                          if (!checked) {
                            props.setFieldValue("spec", "");
                          }
                        }}
                      />
                    </Stack>
                    {props.values.is_teacher && (
                      <TextField
                        name="spec"
                        id="spec"
                        label="Specialization"
                        variant="standard"
                        fullWidth
                        onChange={(event) => {
                          props.values.spec = event.target.value;
                        }}
                        error={!!props.errors.spec}
                        helperText={props.errors.spec ? props.errors.spec : ""}
                      />
                    )}
                    <TextField
                      name="email"
                      id="email"
                      label="Email"
                      variant="standard"
                      fullWidth
                      onChange={(event) => {
                        props.values.email = event.target.value;
                      }}
                      error={!!props.errors.email}
                      helperText={props.errors.email ? props.errors.email : ""}
                    />
                    <TextField
                      name="password"
                      id="password"
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      variant="standard"
                      fullWidth
                      onChange={(event) => {
                        props.values.password = event.target.value;
                      }}
                      error={!!props.errors.password}
                      helperText={
                        props.errors.password ? props.errors.password : ""
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      name="confirm_password"
                      id="confirm_password"
                      type={showPassword ? "text" : "password"}
                      label="Confirm password"
                      variant="standard"
                      fullWidth
                      onChange={(event) => {
                        props.values.confirm_password = event.target.value;
                      }}
                      error={!!props.errors.confirm_password}
                      helperText={
                        props.errors.confirm_password
                          ? props.errors.confirm_password
                          : ""
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button
                      variant="contained"
                      type="submit"
                      fullWidth
                      sx={{ backgroundColor: "rgba(8,81,98,1)" }}
                      startIcon={
                        isLoading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : null
                      }
                      disabled={isLoading ? true : false}
                    >
                      {isLoading ? "Loading..." : "Register"}
                    </Button>
                  </Stack>
                </Box>
              </Form>
            </Box>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default Signup;
