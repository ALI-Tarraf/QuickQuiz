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
} from "@mui/material";

import { useEffect, useState } from "react";
const studentData = {
  students: [
    {
      testname: "Midterm Exam - CS101",
      total: 90,
      id: "1",
      score: 75,
    },
    {
      testname: "Midterm Exam - CS101",
      total: 80,
      id: "123",
      score: 60,
    },
    {
      testname: "Midterm Exam - CS101",
      total: 120,
      id: "1234",
      score: 75,
    },
    {
      testname: "Midterm Exam - CS101",
      total: 110,
      id: "12345",
      score: 59,
    },
    {
      testname: "Midterm Exam - CS101",
      total: 75,
      id: "123456",
      score: 75,
    },
    {
      testname: "Midterm Exam - CS101",
      total: 100,
      id: "12347",
      score: 40,
    },
  ],
};
const StudentTestResults = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [filter, setFilter] = useState("all");
  const [filteredStudents, setFilteredStudents] = useState(
    studentData.students
  );

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  useEffect(() => {
    const newFiltered = studentData.students.filter((student) => {
      const percentage = (student.score / student.total) * 100;
      if (filter === "pass") return percentage >= 60;
      if (filter === "fail") return percentage < 60;
      return true;
    });
    setFilteredStudents(newFiltered);
  }, [filter]);

  return (
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
                    (student.score / student.total) * 100 >= 60
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
                  {student.testname}
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
                      (student.score / student.total) * 100 >= 60
                        ? "green"
                        : "red",
                  }}
                >
                  {student.score}/{student.total}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: { xs: "15px", md: "17px" },
                    fontWeight: { xs: 400, md: 500 },
                    color:
                      (student.score / student.total) * 100 >= 60
                        ? "green"
                        : "red",
                  }}
                >
                  {((student.score / student.total) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StudentTestResults;
