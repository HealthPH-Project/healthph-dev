import { Outlet, useLocation } from "react-router-dom";
import SideNavbar from "../components/SideNavbar";
import SideNavbarWide from "../components/SideNavbarWide";

const DashboardLayout = () => {
  return (
    <div className="dashboard flex max-h-screen">
      {/* <SideNavbar /> */}
      <SideNavbarWide />
      <main className="flex-grow p-[20px] overflow-y-hidden">
        <Outlet />
      </main>
    </div>
  );
};
export default DashboardLayout;
