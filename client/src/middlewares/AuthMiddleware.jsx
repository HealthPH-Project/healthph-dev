import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AuthMiddleware = () => {
  const auth = useSelector((state) => state.auth);
  const location = useLocation().state;

  return auth.user ? (
    <Navigate to={location ? location.from.pathname : "/dashboard"} replace />
  ) : (
    <Outlet />
  );
};
export default AuthMiddleware;
