import { Link } from "react-router-dom";
import Logo from "../assets/images/logo.png";
import HomeNavbar from "../components/HomeNavbar.jsx";

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
        </div>

        <div className="art"></div>
      </main>

      <footer className="flex-col sm:flex-row items-start sm:items-center">
        <div className="footer-logo h-[24px] mb-[16px] sm:mb-0">
          <img src={Logo} alt="" />
        </div>

        <p className="prod-l2 text-gray-300">
          &#169; 2024 HealthPH. All Rights reserved.
        </p>
      </footer>
    </div>
  );
};
export default Home;
