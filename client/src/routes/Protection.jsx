import { Navigate, Outlet } from "react-router-dom";
import userAuthStore from "../store/authStore.js";

const Protection = () => {
  const isAuthenticated = userAuthStore((state) => state.isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default Protection;
