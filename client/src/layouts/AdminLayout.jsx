import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/admin/Navbar";
import { useEffect } from "react";

const AdminLayout = () => {
  const location = useLocation();

  return (
    <>
      <div className="admin-layout flex flex-col max-h-screen h-screen bg-[#F5F5F5] overflow-y-hidden">
        <Navbar />
        {["/dashboard/trends-map"].includes(location.pathname) ? (
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
