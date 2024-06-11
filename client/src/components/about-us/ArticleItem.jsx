import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../Icon";

const ArticleItem = ({ article }) => {
  const {
    articleTitle,
    articleSlug,
    datePublished,
    articlePreview,
    articleImage,
    articleImageCaption,
  } = article;

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchImagePreview = async () => {
      try {
        const response = await import(
          /* @vite-ignore */
          "../../assets/images/articles/preview/" + articleImage
        );
        setPreviewImage(response.default.replace("/@fs", ""));
      } catch (err) {
        console.log(err);
      }
    };
    fetchImagePreview();
  }, [articleImage]);

  return (
    <div className="article-item">
      <div className="article-image">
        <img src={previewImage} alt={articleImageCaption} />
      </div>
      <div className="article-body">
        <p className="date">
          {format(new Date(datePublished), "MMMM dd, yyyy")}
        </p>
        <p className="article-title">{articleTitle}</p>
        <p className="article-preview">{articlePreview}</p>
        <Link
          to={"/articles/" + articleSlug}
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
};
export default ArticleItem;
