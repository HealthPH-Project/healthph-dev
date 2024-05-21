import { Link, NavLink } from "react-router-dom";
import Logo from "../assets/images/logo.png";
import LogoAlt from "../assets/images/logo-alt.png";
import WebLogo from "../assets/images/website-logo.svg";
import WebLogoAlt from "../assets/images/website-logo-alt.svg";
import { useState } from "react";
import HamburgerMenu from "./HamburgerMenu";
import Icon from "./Icon";
const HomeNavbar = () => {
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
  return (
    <nav className="home-nav h-[96px] px-[20px] flex justify-between items-center">
      <div className="flex justify-between items-center w-full max-w-[1326px] mx-auto">
        {/* LOGO */}
        <Link to="/test" className="logo-wrapper h-[44px] me-[16px]">
          <img src={isMenuActive ? WebLogo : WebLogoAlt} alt="" />
        </Link>

        <div className={"home-nav-links " + menuAnimate}>
          {/* NAV LINKS */}
          <ul>
            {/* <li>
            <NavLink to="/" className="prod-btn-lg prod-btn-white">
              <Icon
                iconName="Home"
                height="20px"
                width="20px"
                className="icon"
              />
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/about-us" className="prod-btn-lg prod-btn-white">
              <Icon
                iconName="Information"
                height="20px"
                width="20px"
                className="icon"
              />
              <span>About Us</span>
            </NavLink>
          </li> */}
          </ul>

          {/* CTA*/}
          <div className="home-cta flex justify-center items-center">
            <Link
              to="/login"
              className="prod-btn-lg prod-btn-primary me-[16px]"
            >
              Sign In
            </Link>
            {/* <Link to="/register" className="prod-btn-lg prod-btn-secondary">
            Join HealthPH
          </Link> */}
          </div>
        </div>

        <HamburgerMenu
          isMenuActive={isMenuActive}
          handleClick={handleOpenMenu}
        />
      </div>
      <div
        className={`nav-backdrop md:!hidden  ${
          isMenuActive ? "active" : ""
        } ${menuAnimate} `}
        onAnimationEnd={handleAnimationEnd}
        onClick={handleOpenMenu}
      ></div>
    </nav>
  );
};
export default HomeNavbar;
