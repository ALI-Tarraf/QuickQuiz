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

function App() {
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
