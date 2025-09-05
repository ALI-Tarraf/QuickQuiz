import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
  Avatar,
} from "@mui/material";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import LocalLibraryOutlinedIcon from "@mui/icons-material/LocalLibraryOutlined";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTeacherTestResultsDetails } from "../store/slices/tests/testsSlice";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Errorpage from "../components/ErrorPage";

const TestResultDetails = () => {
  const dispatch = useDispatch();
  const { isLoading, error, teacherResults } = useSelector(
    (state) => state.tests
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [filter, setFilter] = useState("all");
  const [filteredStudents, setFilteredStudents] = useState(
    teacherResults?.student_results
  );

  const { id } = useParams();

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };
  useEffect(() => {
    dispatch(getTeacherTestResultsDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    const newFiltered = teacherResults?.student_results?.filter((student) => {
      const percentage = (student.score / teacherResults.total_marks) * 100;
      if (filter === "pass") return percentage >= 60;
      if (filter === "fail") return percentage < 60;
      return true;
    });
    setFilteredStudents(newFiltered);
  }, [filter, teacherResults]);
  if (isLoading) return <Loader />;

  if (error) return <Errorpage />;
  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 4 } }}>
      <Typography
        sx={{
          fontWeight: { xs: 600, md: "bold" },
          fontSize: { xs: "1.6rem", md: "2rem" },
          py: 2,
          textAlign: "center",
        }}
        gutterBottom
      >
        {teacherResults?.test_title} Results
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: { md: "5%" },
          py: { xs: "10px", md: "20px" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            boxShadow: " 0px 4px 10px rgba(0, 0, 0, 0.2)",
            padding: { xs: 1, md: 2 },
            backgroundColor: "white",
            borderRadius: "30px",
          }}
        >
          <WorkspacePremiumOutlinedIcon />
          <Typography sx={{ fontSize: { xs: "18px", md: "23px" } }}>
            Total mark: {teacherResults?.total_marks}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            boxShadow: " 0px 4px 10px rgba(0, 0, 0, 0.2)",
            padding: { xs: 1, md: 2 },
            backgroundColor: "white",
            borderRadius: "30px",
          }}
        >
          <LocalLibraryOutlinedIcon />
          <Typography sx={{ fontSize: { xs: "18px", md: "23px" } }}>
            participants: {teacherResults?.participants}
          </Typography>
        </Box>
      </Box>
      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={handleFilterChange}
        sx={{ py: { xs: 3, md: 5 } }}
      >
        <ToggleButton value="all">All</ToggleButton>
        <ToggleButton value="pass">Passed</ToggleButton>
        <ToggleButton value="fail">Failed</ToggleButton>
      </ToggleButtonGroup>
      <TableContainer component={Paper}>
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead sx={{ borderBottom: "2px solid black" }}>
            <TableRow
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.1)",
              }}
            >
              <TableCell
                align="center"
                sx={{
                  fontSize: { xs: "17px", md: "25px" },
                  fontWeight: "bold",
                }}
              >
                Name
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontSize: { xs: "17px", md: "25px" },
                  fontWeight: "bold",
                }}
              >
                ID
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontSize: { xs: "17px", md: "25px" },
                  fontWeight: "bold",
                }}
              >
                Score
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontSize: { xs: "17px", md: "25px" },
                  fontWeight: "bold",
                }}
              >
                Percentage
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents?.map((student) => (
              <TableRow
                sx={{
                  backgroundColor:
                    (student.score / teacherResults?.total_marks) * 100 >= 60
                      ? "rgba(172, 255, 47, 0.306)"
                      : "rgb(255, 0, 0,0.306)",
                  borderBottom: "2px solid rgba(128, 128, 128, 0.702)",
                }}
                key={student.id}
              >
                <TableCell
                  align="center"
                  sx={{
                    fontSize: { xs: "15px", md: "17px" },
                    fontWeight: { xs: 400, md: 500 },
                  }}
                >
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    gap={{ xs: 1, md: 2 }}
                    justifyContent={"center"}
                  >
                    <Avatar
                      src={`http://127.0.0.1:8000/storage/${student?.img}`}
                      sx={{
                        width: 40,
                        height: 40,
                      }}
                    />
                    {student.student_name}
                  </Box>
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: { xs: "15px", md: "17px" },
                    fontWeight: { xs: 400, md: 500 },
                  }}
                >
                  {student.id}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: { xs: "15px", md: "17px" },
                    fontWeight: { xs: 400, md: 500 },
                    color:
                      (student.score / teacherResults?.total_marks) * 100 >= 60
                        ? "green"
                        : "red",
                  }}
                >
                  {student.score}/{teacherResults?.total_marks}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: { xs: "15px", md: "17px" },
                    fontWeight: { xs: 400, md: 500 },
                    color:
                      (student.score / teacherResults?.total_marks) * 100 >= 60
                        ? "green"
                        : "red",
                  }}
                >
                  {(
                    (student.score / teacherResults?.total_marks) *
                    100
                  ).toFixed(1)}
                  %
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TestResultDetails;
