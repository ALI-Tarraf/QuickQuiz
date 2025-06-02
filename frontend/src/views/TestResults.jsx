import TeacherTestResults from "../components/TeacherTestResults";
import StudentTestResults from "../components/StudentTestResults";
import Unauthorized from "./Unauthorized";

const TestResults = () => {
  const user = { role: "teacher" };

  switch (user.role) {
    case "teacher":
      return <TeacherTestResults />;
    case "student":
      return <StudentTestResults />;
    default:
      return <Unauthorized />;
  }
};

export default TestResults;
