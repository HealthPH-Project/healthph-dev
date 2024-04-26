import Image from "../assets/react.svg";
import Icon from "../components/Icon.jsx";

const NavLink = ({ iconName, isActive, label }) => {
  return (
    <div
      className={`nav-link rounded-[6px] flex items-center gap-[8px] px-[12px] py-[6px] cursor-pointer ${
        isActive ? "active" : ""
      } `}
    >
      <div className="icon-wrapper flex justify-center items-center">
        <Icon
          iconName={iconName}
          fill="#FFF"
          height="16px"
          width="16px"
          className="icon"
        />
      </div>
      <span className="text-white text-[14px] leading-[20px] tracking-[0.28px] font-medium">
        {label ?? "Navigation"}
      </span>
    </div>
  );
};

const SideNavbarWide = () => {
  return (
    <nav className="w-[190px]">
      <div className="w-full">
        <div className="w-[40px] h-[40px] mb-[24px]">
          <img
            src={Image}
            alt="logo"
            className="w-full h-full object-contain object-center"
          />
        </div>
        <div className="nav-links flex flex-col gap-[16px]">
          <NavLink iconName="Sample" isActive={true} />
          <NavLink iconName="Sample" />
        </div>
      </div>
      <div className="w-full">
        <div className="nav-links flex flex-col gap-[16px]">
          <NavLink iconName="Sample" />
          <NavLink iconName="Sample" label="Logout" />
        </div>
      </div>
    </nav>
  );
};
export default SideNavbarWide;
