import { Navigate } from "react-router-dom";

const RoleProtectedRoute = ({ roles, children }) => {
  const user = { role: "teacher" };
  return roles.includes(user.role) ? children : <Navigate to="/unauthorized" />;
};

export default RoleProtectedRoute;
