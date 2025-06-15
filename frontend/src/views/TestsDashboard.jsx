import { Box, Button, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import ModifyTestsCard from "../components/ModifyTestsCard";

const TestsDashboard = () => {
  const { user } = useSelector((state) => state.auth);

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
    <Box sx={{ px: { xs: 1, sm: 3 } }}>
      <Box>
        <Typography
          sx={{
            py: 2,
            fontWeight: "500",

            fontSize: {
              xs: "1.6rem",
              sm: "2.3rem",
            },
            textAlign: "center",
          }}
        >
          Welcome to tests dashboard {user?.first_name.toLowerCase()} !
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pt: "1rem",
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: {
                xs: "1rem",
                sm: "1.5rem",
              },
              textAlign: "center",
            }}
          >
            Create, edit and delete tests
          </Typography>
          <Button
            variant="contained"
            href={"/createtest"}
            sx={{
              bgcolor: "#4F46E5",
              "&:hover": { bgcolor: "#4338CA" },
              borderRadius: 2,
              textTransform: "none",
              px: { sm: 2 },
              py: { sm: 1 },
            }}
          >
            Create new test
          </Button>
        </Box>
        <Grid
          container
          spacing={{ xs: "10px", sm: "28px" }}
          sx={{ py: { xs: "20px", sm: "30px" } }}
        >
          {exams.map((test, idx) => (
            <Grid item xs={12} md={6} lg={4} xl={3} key={idx}>
              <ModifyTestsCard value={test} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default TestsDashboard;
