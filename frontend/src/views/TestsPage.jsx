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
  }, [dispatch]);

  if (isLoading) return <Loader />;
  if (error) return <Errorpage />;
  if (tests.length == 0)
    return <NoResultsPage message="There are no tests yet" />;
  console.log(tests);
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
