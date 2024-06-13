import HomeNavbar from "../components/HomeNavbar";
import Icon from "../components/Icon";
import IMG from "../assets/images/home-bg.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import Logo from "../assets/images/logo.png";

import ArticlesList from "../assets/data/articles.json";
import ArticleItem from "../components/about-us/ArticleItem";
import Testimonials from "../components/about-us/Testimonials";

const AboutUs2 = () => {
  const features = [
    {
      iconName: "Radar",
      fill: true,
      label: "Early Warning System",
      content: "Identify suspected symptoms before they escalate in one app.",
    },
    {
      iconName: "Stethoscope",
      fill: true,
      label: "Empowering Action",
      content:
        "Provide real-time insights to healthcare professionals for decision-making.",
    },
    {
      iconName: "TowerLine",
      fill: true,
      label: "Bridging the Gap",
      content:
        "Help public health officials monitor all regions through social media data.",
    },
    {
      iconName: "Megaphone",
      fill: true,
      label: "Building Awareness",
      content:
        "Educate the public on health trends and encourage preventive measures.",
    },
    {
      iconName: "Eye",
      fill: true,
      label: "Promoting Transparency",
      content:
        "Offer data-driven insights for a clearer picture of public health in the Philippines.",
    },
    {
      iconName: "Brain",
      fill: false,
      stroke: true,
      label: "Continuous Learning",
      content:
        "Refine our system with evolving social media trends and emerging diseases.",
    },
  ];

  const [articles, setArticles] = useState(
    ArticlesList.sort(
      (a, b) => new Date(b.datePublished) - new Date(a.datePublished)
    ).slice(0, 6)
  );

  const testimonials = [
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

  const [testimonialPage, setTestimonialPage] = useState(1);

  const getTestimonials = () => {
    const startIndex = testimonialPage * 2;

    return testimonials.slice(startIndex - 2, startIndex);
  };

  return (
    <div className="about-layout about-layout2">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="w-full flex flex-col justify-center items-center px-[16px] pb-[112px] hero-wrapper">
          <HomeNavbar />
          <p className="heading mt-[56px]">
            Your Window into Public Health Trends in the Philippines
          </p>
          <p className="subheading">
            HealthPH monitors social media to track suspected symptoms of
            Pulmonary Tuberculosis, Pneumonia, COVID, Acute Upper Respiratory
            Infection (AURI) across all 17 regions.
          </p>
        </div>
        <div className="about-container">
          <div className="my-[112px]">
            <div className="features">
              {features.map(({ iconName, fill, stroke, label, content }, i) => {
                return (
                  <div className="feature-item" key={i}>
                    <div className="icon-wrapper">
                      <Icon
                        iconName={iconName}
                        height="24px"
                        width="24px"
                        className="icon"
                        fill={fill ? "#007AFF" : null}
                        stroke={stroke ? "#007AFF" : null}
                      />
                    </div>
                    <p className="label">{label}</p>
                    <p className="content">{content}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLES */}
      <section className="bg-gray-50 pt-[112px] pb-[56px]">
        <div className="about-container">
          <div className="w-full max-w-[1144px]">
            <p className="section-title">Articles</p>
            <div className="articles">
              {articles.map((a, i) => {
                if (a.articleTitle != "") {
                  return <ArticleItem article={a} key={i} />;
                }
              })}
            </div>
            <div className="w-full flex justify-end">
              <Link
                to="/articles"
                className="prod-btn-lg prod-btn-secondary flex items-center justify-center h-[48px]"
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

      {/* RESEARCH TEAM */}
      <section className="pt-[56px]">
        <div className="about-container">
          <div className="w-full max-w-[1144px]">
            <p className="section-title">Research Team</p>
            <Testimonials />
          </div>
        </div>
      </section>

      <footer className="flex-col sm:flex-row items-start sm:items-center">
        <div className="footer-logo h-[24px] mb-[16px] sm:mb-0">
          <img src={Logo} alt="" />
        </div>

        <p className="prod-l2 text-gray-300">
          &#169; 2024 HealthPH. All Rights reserved.
        </p>
      </footer>
    </div>
  );
};
export default AboutUs2;
