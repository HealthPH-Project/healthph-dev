import { Link } from "react-router-dom";
import Logo from "../assets/images/logo.png";
import HomeNavbar from "../components/HomeNavbar.jsx";
import Icon from "../components/Icon.jsx";

const Home = () => {
  return (
    <div className="home-layout">
      <HomeNavbar />
      <main className="flex-grow">
        <div className="header">
          <p className="heading">
            Protecting Filipinos, One Disease at a time.
          </p>
          <p className="subheading">
            Begin disease surveillance across the Philippines instantly.
            Completely free, intelligent risk monitoring, for all 17
            administrative regions.
          </p>
          <Link
            to="assets/healthph-pre-alpha.apk"
            target="_blank"
            className="prod-btn-lg prod-btn-secondary rounded-[8px] px-[18px] md:px-[28px] py-[10px] md:py-[16px] mt-[24px] flex justify-center items-center"
          >
            <span> Download HealthPH App</span>
            <Icon
              iconName="Download"
              height="24"
              width="24"
              fill="#8693A0"
              className="icon ms-[8px]"
            />
          </Link>
        </div>

        <div className="art"></div>
      </main>

      {/* <footer className="flex-col sm:flex-row items-start sm:items-center">
        <div className="footer-logo h-[24px] mb-[16px] sm:mb-0">
          <img src={Logo} alt="" />
        </div>

        <p className="prod-l2 text-gray-300">
          &#169; 2024 HealthPH. All Rights reserved.
        </p>
      </footer> */}
    </div>
  );
};
export default Home;
