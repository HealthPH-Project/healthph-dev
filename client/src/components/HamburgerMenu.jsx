const HamburgerMenu = ({ isMenuActive, handleClick, additionalClasses }) => {
  return (
    <div className={`hamburger-menu h-[36px] w-[36px] ${additionalClasses}`}>
      <div
        className={`menu-toggler ${isMenuActive ? "active" : ""}`}
        onClick={handleClick}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </div>
  );
};
export default HamburgerMenu;
