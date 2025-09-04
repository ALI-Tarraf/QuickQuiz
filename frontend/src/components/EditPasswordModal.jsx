import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { useState } from "react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { editPassword } from "../store/slices/users/usersSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "70%", md: "50%", lg: "30%" },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  py: 4,
  borderRadius: 2,
};

const loginSchema = yup.object().shape({
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
});

const initialValues = {
  password: "",
  confirm_password: "",
};

const EditPasswordModal = ({ user, userId, setUserId }) => {
  const dispatch = useDispatch();
  const { operationLoading } = useSelector((state) => state.users);
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const submitHandler = (values) => {
    dispatch(editPassword({ password: values.password, id: userId }));

    setOpen(false);
  };
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        sx={{
          borderRadius: 2,
        }}
        onClick={() => {
          setOpen(true);
          setUserId(user?.id);
        }}
        disabled={operationLoading && user?.id === userId ? true : false}
      >
        {operationLoading && user?.id === userId ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <ModeEditOutlineIcon />
        )}
      </Button>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setUserId(null);
        }}
      >
        <Box sx={style}>
          <Stack direction={"row"} alignItems={"center"} gap={1} pb={1}>
            <Typography
              sx={{
                fontWeight: { xs: "500", md: "600" },
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              Change Password!
            </Typography>
          </Stack>

          <Box>
            <Typography sx={{ fontSize: { xs: "1rem", md: "1.3rem" } }}>
              Are you sure you want to change the password of this user?
            </Typography>
            <Formik
              initialValues={initialValues}
              validationSchema={loginSchema}
              validateOnChange={false}
              onSubmit={submitHandler}
            >
              {(props) => (
                <Box sx={{ padding: "1rem", width: "100%" }}>
                  <Form sx={{ width: "100%" }}>
                    <Box
                      component="div"
                      sx={{
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      <Stack
                        direction="column"
                        sx={{ width: "100%" }}
                        spacing={3.5}
                      >
                        <Stack direction="column" spacing={1}>
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
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
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
                              props.values.confirm_password =
                                event.target.value;
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
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
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
                        </Stack>

                        <Stack direction="row" sx={{ gap: "20px" }}>
                          <Button
                            variant="contained"
                            color="error"
                            type="submit"
                            fullWidth
                            sx={{
                              marginTop: "20px",
                              width: "50%",
                              p: "8px",
                              borderRadius: { xs: "5px", md: "8px" },
                            }}
                            startIcon={
                              operationLoading ? (
                                <CircularProgress size={20} color="inherit" />
                              ) : (
                                <ModeEditOutlineIcon />
                              )
                            }
                            disabled={operationLoading ? true : false}
                          >
                            Edit Password
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
                            onClick={() => {
                              setOpen(false);
                              setUserId(null);
                            }}
                          >
                            CANCEL
                          </Button>
                        </Stack>
                      </Stack>
                    </Box>
                  </Form>
                </Box>
              )}
            </Formik>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default EditPasswordModal;
