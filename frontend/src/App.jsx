import { Route, Routes } from "react-router-dom";
import Login from "./views/Login";
import Signup from "./views/SignUp";
import TestsPage from "./views/TestsPage";
import CreateTest from "./views/CreateTest";
import TestPage from "./views/TestPage";
import TestResults from "./views/TestResults";
import TestResultDetails from "./views/TestResultDetails";
import MainLayout from "./views/MainLayout";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import Unauthorized from "./views/Unauthorized";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuthenticatedUser } from "./store/slices/auth/authSlice";
import Cookies from "universal-cookie";

function App() {
  const dispatch = useDispatch();
  const { user, error, status, message } = useSelector((state) => state.auth);

  const cookie = new Cookies();
  const token = cookie.get("access_token");
  useEffect(() => {
    if (!user && token) {
      dispatch(getAuthenticatedUser());
    }
  }, [user, token]);
  return (
    <>
      <Routes>
        {/* with navbar */}
        <Route element={<MainLayout />}>
          <Route path="/testspage" element={<TestsPage />} />
          <Route
            path="/createtest"
            element={
              <RoleProtectedRoute roles={["teacher"]}>
                <CreateTest />
              </RoleProtectedRoute>
            }
          />
          <Route path="/testresults" element={<TestResults />} />
          <Route
            path="/testresults/:id"
            element={
              <RoleProtectedRoute roles={["teacher"]}>
                <TestResultDetails />
              </RoleProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>
        {/* With out navbar */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/testpage/:id" element={<TestPage />} />
      </Routes>
    </>
  );
}

export default App;
