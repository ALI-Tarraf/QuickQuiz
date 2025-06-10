import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";

const RoleProtectedRoute = ({ roles, children }) => {
  const { isLoading, user } = useSelector((state) => state.auth);
  if (user === null || isLoading) return <Loader />;
  else {
    return roles.includes(user?.role) ? (
      children
    ) : (
      <Navigate to="/unauthorized" />
    );
  }
};

export default RoleProtectedRoute;
