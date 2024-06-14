import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import Icon from "../components/Icon";
import HomeNavbar from "../components/HomeNavbar";
import HomeFooter from "../components/HomeFooter";
import ArticleItem from "../components/about-us/ArticleItem";

import ArticlesList from "../assets/data/articles.json";

const Articles = () => {
  const [articles, setArticles] = useState(
    ArticlesList.sort(
      (a, b) => new Date(b.datePublished) - new Date(a.datePublished)
    )
  );

  const [articlePage, setArticlePage] = useState(1);

  const numOfArticlesPerPage = 9;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getArticles = () => {
    const startIndex = articlePage * numOfArticlesPerPage;

    const articlesPerPage = articles;

    return articlesPerPage.slice(startIndex - numOfArticlesPerPage, startIndex);
  };

  return (
    <div className="article-layout">
      <HomeNavbar background="solid" />

      <section className="mt-[56px]">
        <div className="about-container mb-[112px]">
          <div className="w-full max-w-[1144px]">
            {/* <div className="flex justify-start items-center mb-[24px]">
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
            </div> */}
            <p className="section-title">Articles</p>
            <div className="articles">
              {getArticles().map((a, i) => {
                if (a.articleTitle != "") {
                  return <ArticleItem article={a} key={i} />;
                }
              })}
            </div>
            {articles.length > numOfArticlesPerPage && (
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
                  disabled={
                    !(articlePage < ArticlesList.length / numOfArticlesPerPage)
                  }
                  onClick={() => {
                    if (
                      articlePage <
                      ArticlesList.length / numOfArticlesPerPage
                    )
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
            )}
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
};

export default Articles;
