import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Modal,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUser,
  getUsers,
  usersOperationCompleted,
} from "../store/slices/users/usersSlice";
import { formatDate } from "../utils/formateDate";
import Loader from "../components/Loader";
import Errorpage from "../components/ErrorPage";
import OperationAlert from "../components/OperationAlert";
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

function AdminDashboard() {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();
  const {
    isLoading,
    error,
    users,
    operationLoading,
    operationError,
    status,
    message,
  } = useSelector((state) => state.users);
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };
  useEffect(() => {
    const newFiltered = users?.filter((user) => {
      if (filter === "teachers") return user?.role == "teacher";
      if (filter === "students") return user?.role == "student";
      return true;
    });
    setFilteredUsers(newFiltered);
  }, [filter, users]);
  useEffect(() => {
    dispatch(getUsers());
  }, []);
  if (error) return <Errorpage />;
  return (
    <>
      <OperationAlert
        status={status}
        error={operationError}
        message={message}
        completedAction={usersOperationCompleted}
      />
      <Box sx={{ paddingX: { xs: "16px", sm: "24px" } }}>
        <Typography
          sx={{
            fontWeight: "600",
            fontSize: {
              xs: "2rem",
              sm: "2.5rem",
              textAlign: "center",
            },
          }}
        >
          User List
        </Typography>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={handleFilterChange}
          sx={{ py: { xs: 3, md: 5 } }}
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="teachers">Teachers</ToggleButton>
          <ToggleButton value="students">Students</ToggleButton>
        </ToggleButtonGroup>
        {isLoading ? (
          <Loader />
        ) : (
          <TableContainer component={Paper}>
            <Table size={isMobile ? "small" : "medium"}>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <TableCell
                    sx={{
                      fontSize: { xs: "17px", md: "25px" },
                      fontWeight: "bold",
                    }}
                  >
                    User
                  </TableCell>

                  <TableCell
                    sx={{
                      fontSize: { xs: "17px", md: "25px" },
                      fontWeight: "bold",
                    }}
                  >
                    ID
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: { xs: "17px", md: "25px" },
                      fontWeight: "bold",
                    }}
                  >
                    Role
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: { xs: "17px", md: "25px" },
                      fontWeight: "bold",
                    }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: { xs: "17px", md: "25px" },
                      fontWeight: "bold",
                    }}
                  >
                    Spec
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: { xs: "17px", md: "25px" },
                      fontWeight: "bold",
                    }}
                  >
                    Created At
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: { xs: "17px", md: "25px" },
                      fontWeight: "bold",
                    }}
                  >
                    Delete
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers?.map((user, index) => (
                  <TableRow
                    sx={{
                      backgroundColor:
                        index % 2 == 0 ? "white" : "rgba(0, 0, 0, 0.1)",
                    }}
                    key={user.id}
                  >
                    <TableCell
                      sx={{
                        fontSize: { xs: "15px", md: "17px" },
                        fontWeight: { xs: 400, md: 500 },
                      }}
                    >
                      <Stack direction={"row"} gap={2} alignItems={"center"}>
                        <Avatar
                          src={`http://127.0.0.1:8000/storage/${user?.img}`}
                          sx={{
                            width: 40,
                            height: 40,
                          }}
                        />
                        {user.first_name + " " + user.last_name}
                      </Stack>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: { xs: "15px", md: "17px" },
                        fontWeight: { xs: 400, md: 500 },
                      }}
                    >
                      {user.id}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: { xs: "15px", md: "17px" },
                        fontWeight: { xs: 400, md: 500 },
                      }}
                    >
                      {user.role}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: { xs: "15px", md: "17px" },
                        fontWeight: { xs: 400, md: 500 },
                      }}
                    >
                      {user.email}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: { xs: "15px", md: "17px" },
                        fontWeight: { xs: 400, md: 500 },
                      }}
                    >
                      {user.specialization}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: { xs: "15px", md: "17px" },
                        fontWeight: { xs: 400, md: 500 },
                      }}
                    >
                      {formatDate(user.created_at)}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: { xs: "15px", md: "17px" },
                        fontWeight: { xs: 400, md: 500 },
                      }}
                    >
                      <Button
                        variant="contained"
                        color="error"
                        sx={{
                          borderRadius: 2,
                        }}
                        onClick={() => {
                          setOpen(true);
                          setUserId(user.id);
                        }}
                        disabled={
                          operationLoading && user?.id === userId ? true : false
                        }
                      >
                        {operationLoading && user?.id === userId ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <DeleteIcon />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
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
              Delete!
            </Typography>
          </Stack>

          <Box>
            <Typography sx={{ fontSize: { xs: "1rem", md: "1.3rem" } }}>
              Are you sure you want to delete this user?
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
                startIcon={
                  operationLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <DeleteIcon />
                  )
                }
                disabled={operationLoading ? true : false}
                onClick={() => {
                  dispatch(deleteUser(userId));
                  setOpen(false);
                }}
              >
                Delete
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
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default AdminDashboard;
