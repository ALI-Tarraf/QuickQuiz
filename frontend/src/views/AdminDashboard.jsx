import {
  Box,
  Button,
  // CircularProgress,
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
import { getUsers } from "../store/slices/users/usersSlice";
const users = [
  {
    id: 4382,
    username: "Nora",
    lastname: "Johnson",
    role: "student",
    img: "https://via.placeholder.com/150",
    email: "www.google.com",
    specialization: null,
  },
  {
    id: 1957,
    username: "Zane",
    lastname: "Williams",
    role: "teacher",
    img: "https://via.placeholder.com/150",
    email: "www.google.com",
    specialization: "Math",
  },
  {
    id: 6254,
    username: "Ali",
    lastname: "Ahmed",
    role: "teacher",
    email: "www.google.com",
    img: "https://via.placeholder.com/150",
    specialization: "English",
  },
  {
    id: 8916,
    username: "Lina",
    lastname: "Smith",
    role: "student",
    img: "https://via.placeholder.com/150",
    specialization: null,
    email: "www.google.com",
  },
  {
    id: 3098,
    username: "Emma",
    lastname: "Brown",
    role: "teacher",
    email: "www.google.com",
    img: "https://via.placeholder.com/150",
    specialization: "Computer Science",
  },
  {
    id: 7635,
    username: "Fatima",
    lastname: "Garcia",
    role: "student",
    img: "https://via.placeholder.com/150",
    specialization: null,
    email: "www.google.com",
  },
  {
    id: 4701,
    username: "Omar",
    lastname: "Lee",
    email: "www.google.com",
    role: "teacher",
    img: "https://via.placeholder.com/150",
    specialization: "Biology",
  },
  {
    id: 1823,
    username: "Leo",
    lastname: "Chen",
    role: "student",
    email: "www.google.com",
    img: "https://via.placeholder.com/150",
    specialization: null,
  },
  {
    id: 5536,
    username: "Sara",
    lastname: "Williams",
    role: "teacher",
    email: "www.google.com",
    img: "https://via.placeholder.com/150",
    specialization: "Economics",
  },
  {
    id: 3045,
    username: "John",
    lastname: "Ahmed",
    role: "student",
    img: "https://via.placeholder.com/150",
    email: "www.google.com",
    specialization: null,
  },
  {
    id: 7782,
    username: "Ali",
    lastname: "Smith",
    role: "teacher",
    img: "https://via.placeholder.com/150",
    specialization: "History",
    email: "www.google.com",
  },
  {
    id: 9971,
    username: "Nora",
    lastname: "Khan",
    email: "www.google.com",
    role: "student",
    img: "https://via.placeholder.com/150",
    specialization: null,
  },
  {
    id: 4312,
    username: "Leo",
    lastname: "Brown",
    email: "www.google.com",
    role: "teacher",
    img: "https://via.placeholder.com/150",
    specialization: "Physics",
  },
  {
    id: 3194,
    username: "Fatima",
    lastname: "Garcia",
    role: "teacher",
    img: "https://via.placeholder.com/150",
    specialization: "Art",
    email: "www.google.com",
  },
  {
    id: 6451,
    username: "Emma",
    lastname: "Lee",
    role: "student",
    img: "https://via.placeholder.com/150",
    specialization: null,
    email: "www.google.com",
  },
  {
    id: 2157,
    username: "Zane",
    lastname: "Chen",
    email: "www.google.com",
    role: "teacher",
    img: "https://via.placeholder.com/150",
    specialization: "Chemistry",
  },
  {
    id: 9893,
    username: "Omar",
    lastname: "Johnson",
    role: "student",
    email: "www.google.com",
    img: "https://via.placeholder.com/150",
    specialization: null,
  },
  {
    id: 7519,
    username: "Lina",
    lastname: "Smith",
    role: "teacher",
    img: "https://via.placeholder.com/150",
    email: "www.google.com",
    specialization: "Computer Science",
  },
  {
    id: 5803,
    username: "Sara",
    lastname: "Ahmed",
    role: "teacher",
    img: "https://via.placeholder.com/150",
    specialization: "Math",
    email: "www.google.com",
  },
  {
    id: 8467,
    username: "John",
    lastname: "Brown",
    role: "student",
    img: "https://via.placeholder.com/150",
    email: "www.google.com",
    specialization: null,
  },
  {
    id: 6084,
    username: "Fatima",
    lastname: "Hassan",
    role: "teacher",
    img: "https://via.placeholder.com/150",
    specialization: "History",
    email: "www.google.com",
  },
  {
    id: 9261,
    username: "Ali",
    lastname: "Williams",
    role: "student",
    img: "https://via.placeholder.com/150",
    specialization: null,
    email: "www.google.com",
  },
  {
    id: 3246,
    username: "Leo",
    lastname: "Khan",
    role: "teacher",
    img: "https://via.placeholder.com/150",
    specialization: "Geography",
    email: "www.google.com",
  },
  {
    id: 1124,
    username: "Emma",
    lastname: "Lee",
    role: "teacher",
    img: "https://via.placeholder.com/150",
    specialization: "English",
    email: "www.google.com",
  },
  {
    id: 7914,
    username: "Nora",
    lastname: "Johnson",
    role: "student",
    img: "https://via.placeholder.com/150",
    specialization: null,
    email: "www.google.com",
  },
  {
    id: 6681,
    username: "Omar",
    email: "www.google.com",
    lastname: "Ahmed",
    role: "teacher",
    img: "https://via.placeholder.com/150",
    specialization: "Biology",
  },
  {
    id: 2450,
    username: "Zane",
    lastname: "Garcia",
    role: "student",
    img: "https://via.placeholder.com/150",
    specialization: null,
    email: "www.google.com",
  },
  {
    id: 3307,
    username: "Lina",
    lastname: "Chen",
    role: "teacher",
    img: "https://via.placeholder.com/150",
    specialization: "Physics",
    email: "www.google.com",
  },
  {
    id: 9945,
    username: "John",
    lastname: "Khan",
    role: "student",
    img: "https://via.placeholder.com/150",
    email: "www.google.com",
    specialization: null,
  },
  {
    id: 5218,
    username: "Sara",
    lastname: "Smith",
    role: "teacher",
    img: "https://via.placeholder.com/150",
    specialization: "Art",
    email: "www.google.com",
  },
];
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
  const dispatch = useDispatch();

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
  return (
    <>
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
                  Name
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
                    {user.username + " " + user.lastname}
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
                    <Button
                      variant="contained"
                      color="error"
                      sx={{
                        borderRadius: 2,
                      }}
                      onClick={() => {
                        setOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Modal open={open} onClose={() => setOpen(false)}>
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
                  // submitIsLoading ? (
                  //   <CircularProgress size={20} color="inherit" />
                  // ) : (
                  <DeleteIcon />
                  // )
                }
                disabled={
                  // submitIsLoading ? true :
                  false
                }
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
}

export default AdminDashboard;
