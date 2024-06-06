import { Link } from "react-router-dom";
import HomeNavbar from "../components/HomeNavbar";
import Icon from "../components/Icon";
import IMG from "../assets/images/home-bg.png";
import HomeFooter from "../components/HomeFooter";
import { useEffect, useState } from "react";

const Articles = () => {
  const articles = [
    {
      name: "Juan Dela Cruz",
      position: "Position, position",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam, asperiores aliquid. Incidunt totam quae iusto excepturi numquam facilis ipsum harum?",
    },
    {
      name: "Maria Clara",
      position: "Position",
      text: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nostrum itaque porro consectetur cumque quas eius non quae eaque inventore fugiat, aut soluta a suscipit in.",
    },
    {
      name: "John Doe",
      position: "Position, position, position",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti porro repellat laboriosam a consequuntur architecto perspiciatis. Repudiandae, eveniet?",
    },
    {
      name: "Pablo Santos",
      position: "Position, position",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam voluptas soluta dolor, natus dolorem aliquid.",
    },
    {
      name: "Angela Garcia",
      position: "Position, position, position",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti porro repellat laboriosam a consequuntur architecto perspiciatis. Repudiandae, eveniet?",
    },
    {
      name: "Juan Dela Cruz",
      position: "Position",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam, asperiores aliquid. Incidunt totam quae iusto excepturi numquam facilis ipsum harum?",
    },
    {
      name: "Pablo Santos",
      position: "Position, position",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam voluptas soluta dolor, natus dolorem aliquid.",
    },
    {
      name: "Maria Clara",
      position: "Position",
      text: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nostrum itaque porro consectetur cumque quas eius non quae eaque inventore fugiat, aut soluta a suscipit in.",
    },
  ];

  const [articlePage, setArticlePage] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-layout">
      <HomeNavbar />

      <section className="mt-[56px]">
        <div className="about-container mb-[112px]">
          <div className="w-full max-w-[1144px]">
            <div className="flex justify-start items-center mb-[24px]">
              <Link
                to="/about-us"
                className="prod-btn-lg prod-btn-secondary flex items-center"
              >
                <Icon
                  iconName="ArrowLeft"
                  height="24px"
                  width="24px"
                  fill="#8693A0"
                />
                <span className="ms-[8px]">Go Back</span>
              </Link>
            </div>
            <p className="section-title">Articles</p>
            <div className="articles">
              {Array.from({ length: 9 }).map((v, i) => {
                return (
                  <div className="article-item" key={i}>
                    <div className="article-image">
                      <img src={IMG} alt="" />
                    </div>
                    <div className="article-body">
                      <p className="date">Jan 31, 2024</p>
                      <p className="article-title">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Sit non neque nesciunt veritatis nihil ab ea incidunt
                        accusamus qui explicabo.
                      </p>
                      <p className="article-preview">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Nihil illo dicta accusantium quasi quis laboriosam
                        nesciunt veritatis possimus iste. Voluptatibus dolor
                        pariatur eveniet quia culpa?
                      </p>
                      <Link
                        to="/articles/asdsdasd"
                        className="prod-btn-lg prod-btn-secondary"
                      >
                        <span>Read More</span>
                        <Icon
                          iconName="ArrowUpRight"
                          height="24px"
                          width="24px"
                          stroke="#8693A0"
                        />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="w-full flex justify-end">
              <button
                className="prod-btn-lg prod-btn-secondary flex items-center justify-center me-[20px] h-[48px]"
                disabled={!(articlePage > 1)}
                onClick={() => {
                  if (articlePage > 1) {
                    setArticlePage((articlePage) => articlePage - 1);
                  }
                }}
              >
                <Icon
                  iconName="ArrowLeft"
                  height="24px"
                  width="24px"
                  fill="#8693A0"
                />
              </button>
              <button
                className="prod-btn-lg prod-btn-secondary flex items-center justify-center h-[48px]"
                disabled={!(articlePage < articles.length / 2)}
                onClick={() => {
                  if (articlePage < articles.length / 2)
                    setArticlePage((articlePage) => articlePage + 1);
                }}
              >
                <Icon
                  iconName="ArrowRight"
                  height="24px"
                  width="24px"
                  fill="#8693A0"
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
};
export default Articles;
