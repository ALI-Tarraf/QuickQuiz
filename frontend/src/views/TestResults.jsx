import TeacherTestResults from "../components/TeacherTestResults";
import StudentTestResults from "../components/StudentTestResults";
import Unauthorized from "./Unauthorized";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";

const TestResults = () => {
  const { isLoading, user } = useSelector((state) => state.auth);
  if (isLoading || user === null) {
    return <Loader />;
  }
  switch (user?.role) {
    case "teacher":
      return <TeacherTestResults />;
    case "student":
      return <StudentTestResults />;
    default:
      return <Unauthorized />;
  }
};

export default TestResults;
