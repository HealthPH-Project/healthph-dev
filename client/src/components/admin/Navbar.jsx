import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/test-logo.png";
import DashboardLogo from "../../assets/images/dashboard-logo.svg";
import Divider from "../Divider";
import Icon from "../Icon";
import { useEffect, useRef, useState } from "react";
import HamburgerMenu from "../HamburgerMenu";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { deauthenticateUser } from "../../features/auth/authSlice";
import { useCreateActivityLogMutation } from "../../features/api/activityLogsSlice";
import Modal from "./Modal";
import useDeviceDetect from "../../hooks/useDeviceDetect";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);

  const { isPWA } = useDeviceDetect();

  const [isMenuActive, setIsMenuActive] = useState(false);

  const [menuAnimate, setMenuAnimate] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [acctDropdownActive, setAcctDropdownActive] = useState(false);

  const [modalActive, setModalActive] = useState(false);

  const [log_activity] = useCreateActivityLogMutation();

  const handleOpenMenu = () => {
    setIsMenuActive(!isMenuActive);
    setMenuAnimate(!isMenuActive ? "show-menu" : "hide-menu");
  };

  const handleAnimationEnd = (e) => {
    if (e.target.classList.contains("hide-menu")) {
      setMenuAnimate("");
    }
  };

  const dMenu = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (acctDropdownActive && !dMenu?.current?.contains(event.target)) {
        setAcctDropdownActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dMenu]);

  return (
    <nav className="bg-white border-b-[2px] border-[#E5E5E5] h-[68px] flex-shrink-0  px-[20px] py-[16px]">
      <div className="flex justify-between items-center max-w-[1326px] mx-auto">
        {/* LOGO */}
        <Link to="/dashboard" className="logo-wrapper h-[36px] me-[16px]">
          <img src={DashboardLogo} alt="" />
        </Link>

        {/* NAVIGATION */}
        <div
          className={
            "navigation h-full hidden md:flex flex-col md:flex-row justify-between items-center flex-grow " +
            menuAnimate
          }
        >
          <ul className="nav-links flex flex-col md:flex-row items-start w-full">
            <li>
              <NavLink
                to="/dashboard"
                end
                onClick={() => {
                  if (isMenuActive) {
                    handleOpenMenu();
                  }
                }}
              >
                <Icon
                  iconName="Analytics"
                  height="20px"
                  width="20px"
                  className="icon"
                />
                <span>Analytics</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/trends-map"
                onClick={() => {
                  if (isMenuActive) {
                    handleOpenMenu();
                  }
                }}
              >
                <Icon
                  iconName="TrendsMap"
                  height="20px"
                  width="20px"
                  className="icon icon-stroke"
                />
                <span>Trends Map</span>
              </NavLink>
            </li>
            {!isPWA &&
              user &&
              ["ADMIN", "SUPERADMIN"].includes(user.user_type) && (
                <li>
                  <NavLink
                    to="/dashboard/user-management"
                    onClick={() => {
                      if (isMenuActive) {
                        handleOpenMenu();
                      }
                    }}
                  >
                    <Icon
                      iconName="UserThree"
                      height="20px"
                      width="20px"
                      className="icon"
                    />
                    <span>User Management</span>
                  </NavLink>
                </li>
              )}
          </ul>

          {/* SETTINGS */}
          <div className="features flex flex-col md:flex-row justify-center items-center md:h-full flex-shrink-0">
            <ul
              ref={dMenu}
              className={`nav-icons flex flex-col md:flex-row items-start ${
                acctDropdownActive ? "dropdown-active" : ""
              }`}
            >
              <li>
                <NavLink
                  to="/dashboard/help"
                  onClick={() => {
                    if (acctDropdownActive) {
                      setAcctDropdownActive(false);
                    }
                    if (isMenuActive) {
                      handleOpenMenu();
                    }
                  }}
                >
                  <Icon
                    iconName="Help"
                    height="20px"
                    width="20px"
                    className="icon"
                  />
                  <span>Help</span>
                </NavLink>
              </li>
              {!isPWA &&
                user &&
                ["ADMIN", "SUPERADMIN"].includes(user.user_type) && (
                  <li>
                    <NavLink
                      to="/dashboard/activity-logs"
                      onClick={() => {
                        if (acctDropdownActive) {
                          setAcctDropdownActive(false);
                        }
                        if (isMenuActive) {
                          handleOpenMenu();
                        }
                      }}
                    >
                      <Icon
                        iconName="ActivityLog"
                        height="20px"
                        width="20px"
                        className="icon"
                      />
                      <span>Activity Logs</span>
                    </NavLink>
                  </li>
                )}
              <li>
                <NavLink
                  to="/dashboard/settings"
                  onClick={() => {
                    if (acctDropdownActive) {
                      setAcctDropdownActive(false);
                    }
                    if (isMenuActive) {
                      handleOpenMenu();
                    }
                  }}
                >
                  <Icon
                    iconName="Settings"
                    height="20px"
                    width="20px"
                    className="icon"
                  />
                  <span>Settings</span>
                </NavLink>
              </li>
              <li className="!hidden md:!flex lg:!hidden">
                <a
                  className="cursor-pointer"
                  onClick={() => {
                    if (acctDropdownActive) {
                      setAcctDropdownActive(false);
                    }
                    handleOpenMenu();
                    setModalActive(true);
                  }}
                >
                  <Icon
                    iconName="Logout"
                    height="20px"
                    width="20px"
                    className="icon"
                  />
                  <span>Log Out</span>
                </a>
              </li>
            </ul>
            <div className="divider divider-horizontal md:divider-vertical my-[24px] md:my-0 mx-0 md:mx-[16px] lg:!h-[32px] bg-[#BCC5CE]"></div>
            <div className="account flex items-center justify-between w-full">
              <div className="flex flex-col items-start">
                <p className="prod-l3 font-medium text-gray-700">
                  {user["first_name"]} {user["last_name"]}
                </p>
                <p className="prod-l4 font-normal text-gray-500">
                  {user["user_type"].toString().toUpperCase()}
                </p>
              </div>
              <div
                className="icon-wrapper h-[36px] w-[36px] flex md:hidden lg:flex justify-center items-center ms-[16px] cursor-pointer"
                onClick={() => {
                  setModalActive(true);
                }}
              >
                <Icon
                  iconName="Logout"
                  height="20px"
                  width="20px"
                  className="icon"
                />
              </div>
              <div
                className={`icon-wrapper h-[36px] w-[36px] hidden md:flex lg:hidden justify-center items-center ms-[16px] cursor-pointer ${
                  acctDropdownActive ? "active" : ""
                }`}
                onClick={() => {
                  setAcctDropdownActive(!acctDropdownActive);
                }}
              >
                <Icon
                  iconName="ChevronDown"
                  height="20px"
                  width="20px"
                  className="icon"
                />
              </div>
            </div>
          </div>
        </div>

        <HamburgerMenu
          isMenuActive={isMenuActive}
          handleClick={handleOpenMenu}
          additionalClasses="block md:hidden"
        />

        <div
          className={`nav-backdrop md:!hidden  ${
            isMenuActive ? "active" : ""
          } ${menuAnimate} `}
          onAnimationEnd={handleAnimationEnd}
          onClick={handleOpenMenu}
        ></div>
      </div>

      {modalActive && (
        <Modal
          onConfirm={async () => {
            const logged_user = user;

            dispatch(deauthenticateUser());
            Cookies.remove("token");
            localStorage.removeItem("auth");
            navigate("/", { replace: true });

            if (["SUPERADMIN", "ADMIN"].includes(logged_user.user_type)) {
              await log_activity({
                user_id: user.id,
                entry: "Logout",
                module: "Log Out",
              });
            }
          }}
          onConfirmLabel="Sign Out"
          onCancel={() => setModalActive(false)}
          heading="Are you sure you want to sign out?"
          content="You may be required to sign in again to HealthPH."
          color="destructive"
        />
      )}
    </nav>
  );
};
export default Navbar;
