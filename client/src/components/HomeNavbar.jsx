import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "../assets/images/logo.png";
import LogoAlt from "../assets/images/logo-alt.png";
import WebLogo from "../assets/images/website-logo.svg";
import WebLogoAlt from "../assets/images/website-logo-alt.svg";
import { useEffect, useState } from "react";
import HamburgerMenu from "./HamburgerMenu";
import Icon from "./Icon";

import NULogo from "../assets/images/nu-logo.png";
import NULogoLg from "../assets/images/nu-logo-lg.png";
import NULogoLgAlt from "../assets/images/nu-logo-lg-alt.png";

const HomeNavbar = ({ background = "transparent" }) => {
  const location = useLocation();

  const [isMenuActive, setIsMenuActive] = useState(false);

  const [menuAnimate, setMenuAnimate] = useState("");

  const handleOpenMenu = () => {
    setIsMenuActive(!isMenuActive);
    setMenuAnimate(!isMenuActive ? "show-menu" : "hide-menu");
  };

  const handleAnimationEnd = (e) => {
    if (e.target.classList.contains("hide-menu")) {
      setMenuAnimate("");
    }
  };

  const navLinks = [
    { path: "/", iconName: "Home", label: "Home" },
    {
      path: "/about-the-project",
      iconName: "Information",
      label: "About The Project",
    },
    { path: "/articles", iconName: "Document", label: "Articles" },
    { path: "/research-team", iconName: "UserThree", label: "Research Team" },
    { path: "/contact-us", iconName: "Mail", label: "Contact Us" },
  ];

  return (
    <nav
      className={
        "home-nav h-[96px] mx-[20px] flex justify-between items-center background-" +
        background
      }
    >
      <div className="flex justify-between items-center w-full max-w-[1326px] mx-auto">
        {/* LOGO */}
        <div className="flex">
          <Link to="/" className="logo-wrapper h-[44px] me-[16px]">
            <img
              src={isMenuActive || background == "solid" ? WebLogo : WebLogoAlt}
              alt=""
            />
          </Link>
        </div>

        <div className={"home-nav-links " + menuAnimate}>
          {/* NAV LINKS */}
          <ul>
            {navLinks.map(({ path, iconName, label }, i) => {
              return (
                <li key={i}>
                  <NavLink to={path}>
                    <Icon
                      iconName={iconName}
                      height="20px"
                      width="20px"
                      className="icon"
                    />
                    <span>{label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>

          <div className="flex justify-center items-center">
            <div className="w-[152px] h-full">
              <img
                src={
                  isMenuActive || background == "solid" ? NULogoLgAlt : NULogoLg
                }
                alt="national-university"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* CTA*/}
          {/* <div className="home-cta flex justify-center items-center"> */}
          {/* <Link
              to="/login"
              className="prod-btn-lg prod-btn-primary me-[16px]"
            >
              Sign In
            </Link> */}
          {/* <Link
              to="assets/healthph-pre-alpha.apk"
              target="_blank"
              className="prod-btn-lg prod-btn-secondary flex justify-center items-center"
            >
              <span>Download HealthPH</span>
              <Icon
                iconName="Download"
                height="24"
                width="24"
                fill="#8693A0"
                className="icon ms-[8px]"
              />
            </Link> */}

          {/* <Link to="/register" className="prod-btn-lg prod-btn-secondary">
            Join HealthPH
          </Link> */}
          {/* </div> */}
        </div>

        <HamburgerMenu
          isMenuActive={isMenuActive}
          handleClick={handleOpenMenu}
          additionalClasses="block min-[1100px]:hidden"
        />
      </div>
      <div
        className={`nav-backdrop min-[1100px]:!hidden  ${
          isMenuActive ? "active" : ""
        } ${menuAnimate} `}
        onAnimationEnd={handleAnimationEnd}
        onClick={handleOpenMenu}
      ></div>
    </nav>
  );
};
export default HomeNavbar;
