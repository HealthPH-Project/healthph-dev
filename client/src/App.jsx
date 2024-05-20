import "./App.css";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

import { authenticateUser } from "./features/auth/authSlice";

import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";

import DashboardMiddleware from "./middlewares/DashboardMiddleware";
import AuthMiddleware from "./middlewares/AuthMiddleware";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import Analytics from "./pages/admin/Analytics";
import TrendsMap from "./pages/admin/TrendsMap";
import UploadDataset from "./pages/admin/UploadDataset";
import TrendsMap2 from "./pages/admin/TrendsMap2";
import TrendsMap3 from "./pages/admin/TrendsMap3";
import UserManagement from "./pages/admin/UserManagement";
import AddUser from "./pages/admin/AddUser";
import Help from "./pages/admin/Help";
import ActivityLogs from "./pages/admin/ActivityLogs";
import Settings from "./pages/admin/Settings";
import EditEmail from "./pages/admin/EditEmail";
import EditPassword from "./pages/admin/EditPassword";

import PageNotFound from "./pages/error/PageNotFound";
import Test from "./Test";
import HelmetTitle from "./components/HelmetTitle";

function App() {
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log(window.matchMedia("(display-mode: standalone)"));
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth) {
      dispatch(authenticateUser(auth));
    }
    setIsLoading(false);
  }, []);

  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <>
      <Routes>
        <Route path="/test" element={<Test />}></Route>
        <Route path="/" element={<AuthMiddleware />}>
          <Route
            index
            element={
              <>
                <HelmetTitle title="HealthPH" />
                <Home />
              </>
            }
          ></Route>
          <Route element={<AuthLayout />}>
            <Route
              path="login"
              element={
                <>
                  <HelmetTitle title="HealthPH | Sign In" />
                  <Login />
                </>
              }
            ></Route>
            <Route
              path="forgot-password"
              element={
                <>
                  <HelmetTitle title="HealthPH | Forgot Password" />
                  <ForgotPassword />
                </>
              }
            ></Route>
            <Route
              path="reset-password/:token"
              element={
                <>
                  <HelmetTitle title="HealthPH | Reset Password" />
                  <ResetPassword />
                </>
              }
            ></Route>
          </Route>
        </Route>
        <Route element={<DashboardMiddleware />}>
          <Route path="/dashboard" element={<AdminLayout />}>
            <Route
              index
              element={
                <>
                  <HelmetTitle title="HealthPH | Analytics" />
                  <Analytics />
                </>
              }
            />
            <Route
              path="trends-map"
              element={
                <>
                  <HelmetTitle title="HealthPH | Trends Map" />
                  <TrendsMap />
                </>
              }
            />
            <Route
              path="trends-map/upload-dataset"
              element={
                user && ["ADMIN", "SUPERADMIN"].includes(user.user_type) ? (
                  <>
                    <HelmetTitle title="HealthPH | Upload Dataset" />
                    <UploadDataset />
                  </>
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
            <Route path="trends-map2" element={<TrendsMap2 />} />
            <Route path="trends-map3" element={<TrendsMap3 />} />
            <Route
              path="user-management"
              element={
                user && ["ADMIN", "SUPERADMIN"].includes(user.user_type) ? (
                  <>
                    <HelmetTitle title="HealthPH | User Management" />
                    <UserManagement />
                  </>
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
            <Route
              path="user-management/add-user"
              element={
                user && ["ADMIN", "SUPERADMIN"].includes(user.user_type) ? (
                  <>
                    <HelmetTitle title="HealthPH | Add User" />
                    <AddUser />
                  </>
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
            <Route
              path="help"
              element={
                <>
                  <HelmetTitle title="HealthPH | Help" />
                  <Help />
                </>
              }
            />
            <Route
              path="activity-logs"
              element={
                user && ["ADMIN", "SUPERADMIN"].includes(user.user_type) ? (
                  <>
                    <HelmetTitle title="HealthPH | Activity Logs" />
                    <ActivityLogs />
                  </>
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
            <Route
              path="settings"
              element={
                <>
                  <HelmetTitle title="HealthPH | Settings" />
                  <Settings />
                </>
              }
            />
            <Route
              path="settings/edit-email"
              element={
                <>
                  <HelmetTitle title="HealthPH | Edit Email" />
                  <EditEmail />
                </>
              }
            />
            <Route
              path="settings/edit-password"
              element={
                <>
                  <HelmetTitle title="HealthPH | Edit Password" />
                  <EditPassword />
                </>
              }
            />
            <Route
              path="*"
              element={
                <>
                  <HelmetTitle title="HealthPH | Page Not Found" />
                  <PageNotFound />
                </>
              }
            />
          </Route>
          {/* <Route path="/*" element={<AdminLayout />}>
            <Route
              path="*"
              element={
                <>
                  <HelmetTitle title="HealthPH | Page Not Found" />
                  <PageNotFound />
                </>
              }
            />
          </Route> */}
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* TOAST CONTAINER */}
      <ToastContainer
        hideProgressBar
        pauseOnHover={false}
        autoClose={3000}
        className="snackbar-wrapper"
      />
    </>
  );
}

export default App;
