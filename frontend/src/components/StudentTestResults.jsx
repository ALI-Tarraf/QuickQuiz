import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  useMediaQuery,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from "@mui/material";
import { getStudentTestResults } from "../store/slices/tests/testsSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import Errorpage from "./ErrorPage";

const StudentTestResults = () => {
  const { isLoading, error, studentResults } = useSelector(
    (state) => state.tests
  );

  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [filter, setFilter] = useState("all");
  const [filteredStudents, setFilteredStudents] = useState([]);

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };
  useEffect(() => {
    dispatch(getStudentTestResults());
  }, [dispatch]);

  useEffect(() => {
    console.log(studentResults);
    const newFiltered = studentResults?.filter((student) => {
      const percentage = (student.score / student.total_marks) * 100;
      if (filter === "pass") return percentage >= 60;
      if (filter === "fail") return percentage < 60;
      return true;
    });
    setFilteredStudents(newFiltered);
  }, [filter, studentResults]);
  if (isLoading) return <Loader />;

  if (error) return <Errorpage />;

  return (
    <>
      <Typography
        sx={{
          fontWeight: { xs: 600, md: "bold" },
          fontSize: { xs: "1.6rem", sm: "2rem ", lg: "2.3rem" },
          pt: 4,
          textAlign: "center",
        }}
      >
        Test Results
      </Typography>
      <Box sx={{ p: { xs: 1, sm: 2, md: 4 } }}>
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
                  Score/Total score
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
                      (student.score / student.total_marks) * 100 >= 60
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
                    {student.exam_title}
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
                        (student.score / student.total_marks) * 100 >= 60
                          ? "green"
                          : "red",
                    }}
                  >
                    {student.score}/{student.total_marks}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: { xs: "15px", md: "17px" },
                      fontWeight: { xs: 400, md: 500 },
                      color:
                        (student.score / student.total_marks) * 100 >= 60
                          ? "green"
                          : "red",
                    }}
                  >
                    {((student.score / student.total_marks) * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default StudentTestResults;
