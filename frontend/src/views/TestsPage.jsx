import { Grid } from "@mui/material";

import TestCard from "../components/TestCard";

const TestsPage = () => {
  const exams = [
    {
      id: 1,
      title: "Midterm Exam - CS101",
      date: "May 10, 2025",
      time: "10:47 AM",
      instructor: "Dr. Jane Smith",
      duration: "60 mins",
      totalMarks: 100,
      status: "available",
    },
    {
      id: 2,
      title: "Final Exam - Math 202",
      date: "June 1, 2025",
      time: "10:47 AM",
      instructor: "Prof. Ahmed Khan",
      duration: "90 mins",
      totalMarks: 150,
      status: "not available",
    },
    {
      id: 3,
      title: "Quiz - Biology 110",
      date: "May 5, 2025",
      time: "10:47 AM",
      instructor: "Dr. Lina Park",
      duration: "30 mins",
      totalMarks: 50,
      status: "available",
    },
    {
      id: 4,
      title: "Practice Test - History 301",
      date: "May 15, 2025",
      time: "10:47 AM",
      instructor: "Dr. George Miller",
      duration: "45 mins",
      totalMarks: 75,
      status: "available",
    },
    {
      id: 5,
      title: "Mock Exam - Physics 205",
      date: "May 20, 2025",
      time: "10:47 AM",
      instructor: "Prof. Fatima Noor",
      duration: "120 mins",
      totalMarks: 200,
      status: "not available",
    },
  ];
  return (
    <>
      <Grid
        container
        spacing={{ xs: "10px", sm: "28px" }}
        sx={{ p: { xs: "10px", sm: "20px" } }}
      >
        {exams.map((exam, idx) => (
          <Grid item xs={12} md={6} lg={4} xl={3} key={idx}>
            <TestCard value={exam} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default TestsPage;
