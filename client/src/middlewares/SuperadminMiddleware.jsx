import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
const SuperadminMiddleware = () => {
  const user = useSelector((state) => state.auth.user);
  return user.user_type == "SUPERADMIN" ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" replace />
  );
};
export default SuperadminMiddleware;
