const HamburgerMenu = ({ isMenuActive, handleClick }) => {
  return (
    <div className="hamburger-menu h-[36px] w-[36px] block min-[900px]:hidden">
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
