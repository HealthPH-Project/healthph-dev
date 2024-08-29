import { Link, useLocation, useParams } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { format } from "date-fns";

import Icon from "../components/Icon";
import HomeNavbar from "../components/HomeNavbar";
import HomeFooter from "../components/HomeFooter";

import ArticlesList from "../assets/data/articles.json";
import ArticleItem from "../components/about-us/ArticleItem";

const ArticlePage = () => {
  const { slug } = useParams();

  const article = ArticlesList.find((a) => a.articleSlug == slug);

  const latestArticles = ArticlesList.sort(
    (a, b) => new Date(b.datePublished) - new Date(a.datePublished)
  )
    .filter((a) => a.articleSlug != slug)
    .slice(0, 4);

  const {
    articleTitle,
    readDuration,
    datePublished,
    articlePreview,
    articleImage,
    articleImagePosition,
    articleImageCaption,
    galleryFolder,
    galleryImages,
    articleBody,
  } = article;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const [previewImage, setPreviewImage] = useState(null);

  // useEffect(() => {
  //   const fetchImagePreview = async () => {
  //     try {
  //       const response = await import(
  //         /* @vite-ignore */
  //         "../assets/images/articles/preview/" + articleImage
  //       );
  //       setPreviewImage(response.default.replace("/@fs", ""));
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   if (articleImage) fetchImagePreview();
  // }, [articleImage]);

  const [imageModalActive, setImageModalActive] = useState(false);

  const [modalData, setModalData] = useState({ src: "", caption: "" });

  const location = useLocation();

  return (
    <div className="article-page-layout">
      <HomeNavbar background="solid" />
      <section
        className="article-hero-wrapper"
        style={{
          backgroundImage:
            "url('/assets/articles/preview/" + articleImage + "')",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="article-hero-overlay"></div>
        <div className="article-hero ">
          <div className="flex justify-start items-center mb-[24px]">
            <Link
              to="/articles"
              state={location.state}
              className="prod-btn-lg prod-btn-secondary flex items-center"
            >
              <Icon
                iconName="ArrowLeft"
                height="24px"
                width="24px"
                fill="#8693A0"
              />
              <span className="ms-[8px]">Back to Article List</span>
            </Link>
          </div>
          <div className="article-header">
            <p className="article-title">{articleTitle}</p>
            <p className="article-content my-[24px]">
              {/* {readDuration} •{" "}
              {format(new Date(datePublished), "MMMM dd, yyyy")} */}
            </p>
            <p className="article-content">{articlePreview}</p>
          </div>
        </div>
      </section>
      <section className="article-container">
        <div className="article-wrapper mt-[56px] ">
          {/* ARTICLE BODY */}
          <div className="article-body">
            <p>
              {articleBody.split("\n").map((v, i) => {
                const isLast = i == articleBody.split("\n").length - 1;
                return (
                  <Fragment key={i}>
                    <span>{v}</span>
                    {!isLast && (
                      <>
                        <br /> <br />
                      </>
                    )}
                  </Fragment>
                );
              })}
            </p>
          </div>

          {/* ARTICLE GALLERY */}
          <div className="article-gallery">
            {galleryImages.map(({ filename, caption }, i) => {
              const imagePath =
                "/assets/articles/gallery/" + galleryFolder + "/";
              return (
                <div className="gallery-item" key={i}>
                  <div
                    className="image-wrapper"
                    onClick={() => {
                      setModalData({
                        src: imagePath + filename,
                        caption: caption,
                      });
                      setImageModalActive(true);
                    }}
                  >
                    <img src={imagePath + filename} alt={caption} />
                  </div>
                  <p className="gallery-caption article-caption">{caption}</p>
                </div>
              );
            })}
          </div>

          {/* LATEST ARTICLES */}
          <div className="latest-articles">
            <div className="flex items-center justify-start mb-[24px]">
              <p className="section-title">Latest Articles</p>
            </div>
            <div className="articles mb-[24px]">
              {latestArticles.map((a, i) => {
                if (a.articleTitle != "") {
                  return <ArticleItem article={a} key={i} />;
                }
              })}
            </div>
            <div className="flex items-center justify-end">
              <Link
                to="/articles"
                className="prod-btn-lg prod-btn-secondary flex items-center"
              >
                <span className="me-[8px]">See All Articles</span>
                <Icon
                  iconName="ArrowRight"
                  height="24px"
                  width="24px"
                  fill="#8693A0"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HomeFooter />

      {imageModalActive && (
        <div className="image-modal">
          <div
            className="image-modal-backdrop"
            onClick={() => {
              setImageModalActive(false);
              setModalData({ src: "", caption: "" });
            }}
          ></div>
          <div className="image-modal-container">
            <div className="image-wrapper">
              <img src={modalData.src} alt={modalData.caption} />
            </div>
            <p className="image-caption">{modalData.caption}</p>
            <div
              className="close-icon"
              onClick={() => {
                setImageModalActive(false);
                setModalData({ src: "", caption: "" });
              }}
            >
              <Icon
                iconName="Close"
                height="24px"
                width="24px"
                className="icon"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ArticlePage;
