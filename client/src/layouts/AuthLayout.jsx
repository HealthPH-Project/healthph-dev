import { Outlet, useLocation } from "react-router-dom";
import Logo from "../assets/images/logo.png";
import AuthLogo from "../assets/images/auth-logo.svg";
import Icon from "../components/Icon";
const AuthLayout = () => {
  return (
    <>
      <div className="auth-layout">
        <main>
          {/* <Outlet /> */}
          <div className="auth-container">
            <Outlet />
          </div>
          <footer>
            <span>&#169; HealthPH 2024</span>
            <a
              href={"mailto:" + import.meta.env.VITE_HEALTHPH_EMAIL}
              className="flex items-center"
            >
              <Icon
                iconName="Mail"
                height="16px"
                width="16px"
                fill="#8693A0"
                className="me-[8px]"
              />
              <span>{import.meta.env.VITE_HEALTHPH_EMAIL}</span>
            </a>
          </footer>
        </main>
        <div className="content">
          <div className="logo-wrapper">
            <img src={AuthLogo} alt="" />
          </div>
          <p className="heading">
            Protecting Filipinos, One Disease at a time.
          </p>
          <p className="subheading">
            Begin disease surveillance across the Philippines instantly.
            Completely free, intelligent risk monitoring, for all 17
            administrative regions.
          </p>
        </div>
        <div className="background"></div>
      </div>
    </>
  );
};
export default AuthLayout;
