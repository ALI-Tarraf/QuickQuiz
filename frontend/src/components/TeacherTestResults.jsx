import { Grid } from "@mui/material";
import TestCard from "./TestCard";
import { getTeacherTestResults } from "../store/slices/tests/testsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Loader from "./Loader";
import Errorpage from "./ErrorPage";
import NoResultsPage from "./NoResultsPage";

const TeacherTestResults = () => {
  const { isLoading, error, finshedtests } = useSelector(
    (state) => state.tests
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTeacherTestResults());
  }, [dispatch]);
  if (isLoading) return <Loader />;
  if (error) return <Errorpage />;
  if (finshedtests?.length == 0) return <NoResultsPage />;
  return (
    <>
      <Grid
        container
        spacing={{ xs: "10px", sm: "28px" }}
        sx={{ p: { xs: "10px", sm: "20px" } }}
      >
        {finshedtests?.map((test, idx) => (
          <Grid item xs={12} md={6} lg={4} xl={3} key={idx}>
            <TestCard value={test} isInResultsPage={true} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default TeacherTestResults;
