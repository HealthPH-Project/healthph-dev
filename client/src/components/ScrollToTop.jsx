import { useEffect, useState } from "react";
import Icon from "../components/Icon";

const ScrollToTop = () => {
  const [isPageScrolled, setIsPageScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementsByTagName("main")[0];
      setIsPageScrolled(el.scrollTop > 400);
    };

    const el = document.getElementsByTagName("main")[0];

    el.addEventListener("scroll", handleScroll);

    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`scroll-to-top ${isPageScrolled ? "active" : ""}`}
      onClick={() => {
        var elem = document.getElementsByTagName("main")[0];
        elem.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }}
    >
      <Icon
        iconName="ArrowUp"
        fill="#FFF"
        className="icon"
        height="24px"
        width="24px"
      />
    </div>
  );
};
export default ScrollToTop;
