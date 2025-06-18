import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/Loader";
import NavBar from "../components/NavBar";

const ProtectedRoute = () => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const token = localStorage.getItem("access_token");
  if (isLoading)
    return (
      <>
        <NavBar />
        <Loader />;
      </>
    );
  if (token) return <Outlet />;
  if (!token && !isLoading && !user) return <Navigate to="/" replace />;
};

export default ProtectedRoute;
