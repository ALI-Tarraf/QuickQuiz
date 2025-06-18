import { Grid } from "@mui/material";
import TestCard from "../components/TestCard";
import { getTests } from "../store/slices/tests/testsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Loader from "../components/Loader";
import Errorpage from "../components/ErrorPage";
import NoResultsPage from "../components/NoResultsPage";
const TestsPage = () => {
  const { isLoading, error, tests } = useSelector((state) => state.tests);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTests());
    console.log(tests);
  }, [dispatch]);

  if (isLoading) return <Loader />;
  if (error) return <Errorpage />;
  if (tests.length == 0)
    return <NoResultsPage message="There are no tests yet" />;

  // const date = dayjs("2025-06-14", "DD-MM-YYYY").toDate();
  // const dateOnly = new Date().toLocaleDateString("en-CA");
  // console.log(new Date());
  // console.log(dateOnly);
  // console.log(date);
  // console.log("2025-06-14");
  // console.log(tests[0].date);
  // console.log(tests[0].date == "2025-05-20");

  // const targetTime = "13:20:00";

  // // Get current time
  // const now = new Date();

  // // Extract hours, minutes, seconds
  // const [targetHours, targetMinutes, targetSeconds] = targetTime
  //   .split(":")
  //   .map(Number);

  // // Create a Date object for today at the target time
  // const targetDate = new Date();
  // targetDate.setHours(targetHours, targetMinutes, targetSeconds, 0);

  // // Compare
  // if (now > targetDate) {
  //   console.log(now);
  //   console.log(targetDate);
  //   console.log("Current time is after 13:20:00");
  // } else {
  //   console.log(now);
  //   console.log(targetDate);
  //   console.log("Current time is before 13:20:00");
  // }

  return (
    <>
      <Grid
        container
        spacing={{ xs: "10px", sm: "28px" }}
        sx={{ p: { xs: "10px", sm: "20px" } }}
      >
        {tests.map((test, idx) => (
          <Grid item xs={12} md={6} lg={4} xl={3} key={idx}>
            <TestCard value={test} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default TestsPage;
