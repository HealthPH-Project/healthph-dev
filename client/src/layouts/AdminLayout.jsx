import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/admin/Navbar";
import { useSelector } from "react-redux";
import AccessDenied from "../pages/error/AccessDenied";

const AdminLayout = () => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <div className="admin-layout flex flex-col max-h-screen h-screen bg-[#F5F5F5] overflow-y-hidden">
        <Navbar />
        {user.is_disabled ? (
          <main className="w-full p-[20px]">
            <AccessDenied />
          </main>
        ) : ["/dashboard/trends-map"].includes(location.pathname) ? (
          <main className="w-full">
            <Outlet />
          </main>
        ) : (
          <main className="w-full p-[20px]">
            <Outlet />
          </main>
        )}
      </div>
    </>
  );
};
export default AdminLayout;
