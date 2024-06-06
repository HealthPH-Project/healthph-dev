import Logo from "../assets/images/logo.png";
const HomeFooter = () => {
  return (
    <footer className="flex-col sm:flex-row items-start sm:items-center">
      <div className="footer-logo h-[24px] mb-[16px] sm:mb-0">
        <img src={Logo} alt="" />
      </div>

      <p className="prod-l2 text-gray-300">
        &#169; 2024 HealthPH. All Rights reserved.
      </p>
    </footer>
  );
};
export default HomeFooter;
