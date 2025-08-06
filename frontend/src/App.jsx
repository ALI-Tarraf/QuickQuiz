import { Route, Routes } from "react-router-dom";
import Login from "./views/Login";
import Signup from "./views/SignUp";
import TestsPage from "./views/TestsPage";
import CreateTest from "./views/CreateTest";
import TestPage from "./views/TestPage";
import TestResults from "./views/TestResults";
import TestResultDetails from "./views/TestResultDetails";
import MainLayout from "./views/MainLayout";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import Unauthorized from "./views/Unauthorized";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  authOperationCompleted,
  getAuthenticatedUser,
} from "./store/slices/auth/authSlice";
import OperationAlert from "./components/OperationAlert";
import ProtectedRoute from "./routes/ProtectedRoute";
import TestsDashboard from "./views/TestsDashboard";
import UpdateTest from "./views/UpdateTest";
import AdminDashboard from "./views/AdminDashboard";

function App() {
  const dispatch = useDispatch();
  const { user, error, status, message } = useSelector((state) => state.auth);

  const token = localStorage.getItem("access_token");
  useEffect(() => {
    if (!user && token) {
      dispatch(getAuthenticatedUser());
    }
  }, [token]);

  return (
    <main>
      <OperationAlert
        status={status}
        error={error}
        message={message}
        completedAction={authOperationCompleted}
      />
      <Routes>
        {/* with navbar */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route
              path="/testspage"
              element={
                <RoleProtectedRoute roles={["teacher", "student"]}>
                  <TestsPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/testresults"
              element={
                <RoleProtectedRoute roles={["teacher", "student"]}>
                  <TestResults />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/admindashboard"
              element={
                <RoleProtectedRoute roles={["admin"]}>
                  <AdminDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/testresults/:id"
              element={
                <RoleProtectedRoute roles={["teacher"]}>
                  <TestResultDetails />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/createtest"
              element={
                <RoleProtectedRoute roles={["teacher"]}>
                  <CreateTest />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/testsdashboard"
              element={
                <RoleProtectedRoute roles={["teacher"]}>
                  <TestsDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/testsdashboard/:id"
              element={
                <RoleProtectedRoute roles={["teacher"]}>
                  <UpdateTest />
                </RoleProtectedRoute>
              }
            />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Route>
          {/* With out navbar */}

          <Route
            path="/testpage/:id"
            element={
              <RoleProtectedRoute roles={["teacher", "student"]}>
                <TestPage />
              </RoleProtectedRoute>
            }
          />
        </Route>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </main>
  );
}

export default App;
