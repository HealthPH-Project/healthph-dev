import { Link, useParams } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { format } from "date-fns";

import Icon from "../components/Icon";
import HomeNavbar from "../components/HomeNavbar";
import HomeFooter from "../components/HomeFooter";

import ArticlesList from "../assets/data/articles.json";

const ArticlePage = () => {
  const { slug } = useParams();

  const article = ArticlesList.find((a) => a.articleSlug == slug);

  const {
    articleTitle,
    readDuration,
    datePublished,
    articlePreview,
    articleImage,
    articleImageCaption,
    galleryFolder,
    galleryImages,
    articleBody,
  } = article;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchImagePreview = async () => {
      try {
        const response = await import(
          /* @vite-ignore */
          "../assets/images/articles/preview/" + articleImage
        );
        setPreviewImage(response.default.replace("/@fs", ""));
      } catch (err) {
        console.log(err);
      }
    };

    if (articleImage) fetchImagePreview();
  }, [articleImage]);

  const [imageModalActive, setImageModalActive] = useState(false);

  const [modalData, setModalData] = useState({ src: "", caption: "" });

  return (
    <div className="article-layout">
      <HomeNavbar background="solid" />
      <section className="mt-[56px]">
        <div className="article-container">
          <div className="article-wrapper">
            <div className="flex justify-start items-center mb-[24px]">
              <Link
                to="/articles"
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
                {readDuration} •{" "}
                {format(new Date(datePublished), "MMMM dd, yyyy")}
              </p>
              <p className="article-content">{articlePreview}</p>
            </div>
            <div className="article-preview">
              <div className="article-image-wrapper">
                <img src={previewImage} alt={articleImageCaption} />
              </div>
              <p className="article-caption">{articleImageCaption}</p>
            </div>

            <div className="article-body">
              <p>
                {articleBody.split("\n").map((v, i) => {
                  const isLast = i == articleBody.split("\n") - 1;
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

            <div className="article-gallery">
              {galleryImages.map(({ filename, caption }, i) => {
                const imagePath =
                  "/src/assets/images/articles/gallery/" + galleryFolder + "/";
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
                    <p className="article-caption">{caption}</p>
                  </div>
                );
              })}
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
