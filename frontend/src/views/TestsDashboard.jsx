import { Box, Button, Grid, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import ModifyTestsCard from "../components/ModifyTestsCard";
import { useEffect } from "react";
import Loader from "../components/Loader";
import Errorpage from "../components/ErrorPage";
import {
  getUpcomingTests,
  testsOperationCompleted,
} from "../store/slices/tests/testsSlice";
import NoResultsPage from "../components/NoResultsPage";
import OperationAlert from "../components/OperationAlert";

const TestsDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { isLoading, error, operationError, upcomingTests, status, message } =
    useSelector((state) => state.tests);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUpcomingTests());
  }, [dispatch]);
  {
    console.log(upcomingTests);
  }
  if (isLoading) return <Loader />;
  if (error) return <Errorpage />;

  return (
    <Box sx={{ px: { xs: 1, sm: 3 } }}>
      <OperationAlert
        status={status}
        error={operationError}
        message={message}
        completedAction={testsOperationCompleted}
      />
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

        {upcomingTests?.length === 0 ? (
          <NoResultsPage message="There are no tests to edit or delete yet" />
        ) : (
          <Grid
            container
            spacing={{ xs: "10px", sm: "28px" }}
            sx={{ py: { xs: "20px", sm: "30px" } }}
          >
            {upcomingTests?.map((test, idx) => (
              <Grid item xs={12} md={6} lg={4} xl={3} key={idx}>
                <ModifyTestsCard value={test} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default TestsDashboard;
