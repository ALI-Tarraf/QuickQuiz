import { useEffect, useState } from "react";
import backgroundImage from "../assets/intro1.jpg";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/auth/authSlice";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password is too short - should be 8 chars minimum."),
  });

  const initialValues = {
    email: "",
    password: "",
  };
  const submitHandler = (values) => {
    dispatch(login({ email: values.email, password: values.password }));
  };
  useEffect(() => {
    if (user) navigate("/testspage");
  }, [user]);
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
          onSubmit={submitHandler}
        >
          {(props) => (
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
                  padding: "1rem",
                  bgcolor: "rgba(240, 248, 255, 0.8)",
                  borderRadius: 7,
                }}
              >
                <Typography variant="h6" sx={{ textAlign: "center", mb: 4 }}>
                  Login to your account
                </Typography>

                <Stack direction="column" spacing={3.5}>
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
                            {showPassword ? <VisibilityOff /> : <Visibility />}
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
                  >
                    {isLoading ? "Loading..." : "Login"}
                  </Button>
                </Stack>
                <Typography
                  variant="subtitle2"
                  sx={{
                    textAlign: "center",
                    marginTop: 3.5,
                  }}
                >
                  <Box component="span">{`Don't have an account? `}</Box>
                  <NavLink to="/signup" style={{ textDecoration: "none" }}>
                    <Box
                      component="span"
                      sx={{
                        color: "black",
                        borderBottom: "1px solid",
                      }}
                    >
                      Sign Up
                    </Box>
                  </NavLink>
                </Typography>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default Login;
