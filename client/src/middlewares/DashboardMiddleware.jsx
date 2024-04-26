import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const DashboardMiddleware = () => {
  const auth = useSelector((state) => state.auth);
  const location = useLocation();

  return auth.user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
export default DashboardMiddleware;
