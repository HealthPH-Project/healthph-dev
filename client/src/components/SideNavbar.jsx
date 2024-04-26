import Image from "../assets/react.svg";
import Icon from "../components/Icon.jsx";

const NavIcon = ({ iconName, isActive, label }) => {
  return (
    <div className={`nav-link-icon cursor-pointer ${isActive ? "active" : ""}`}>
      <div className="icon-wrapper p-[8px] rounded-[6px] flex justify-center items-center">
        <Icon
          iconName={iconName}
          fill="#FFF"
          height="24px"
          width="24px"
          className="icon"
        />
      </div>
      <span>{label ?? "Label"}</span>
    </div>
  );
};

const SideNavbar = () => {
  return (
    <nav className="w-[72px] border-e-2">
      <div>
        <div className="w-[40px] h-[40px] mb-[24px]">
          <img
            src={Image}
            alt="logo"
            className="w-full h-full object-contain object-center"
          />
        </div>
        <div className="nav-links flex flex-col gap-[16px]">
          <NavIcon iconName="Sample" isActive={true} />
          <NavIcon iconName="Sample" />
        </div>
      </div>
      <div>
        <div className="nav-links flex flex-col gap-[16px]">
          <NavIcon iconName="Sample" />
          <NavIcon iconName="Sample" />
        </div>
      </div>
    </nav>
  );
};
export default SideNavbar;
