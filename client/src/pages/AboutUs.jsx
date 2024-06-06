import HomeNavbar from "../components/HomeNavbar";
import Icon from "../components/Icon";
import IMG from "../assets/images/home-bg.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import Logo from "../assets/images/logo.png";

const AboutUs = () => {
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
    <div className="about-layout">
      <HomeNavbar />

      {/* HERO SECTION */}
      <section className="mt-[56px] hero">
        <div className="flex flex-col justify-center items-center px-[16px]">
          <p className="heading">
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
      <section>
        <div className="about-container mb-[112px]">
          <div className="w-full max-w-[1144px]">
            <p className="section-title">Articles</p>
            <div className="articles">
              {Array.from({ length: 6 }).map((v, i) => {
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
                      <Link to="/" className="prod-btn-lg prod-btn-secondary">
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
      <section>
        <div className="about-container">
          <div className="w-full max-w-[1144px]">
            <p className="section-title">Research Team</p>
            <div className="testimonials">
              {getTestimonials().map(({ name, position, text }, i) => {
                return (
                  <div className="testimonial-item" key={i}>
                    <div className="testimonial-header">
                      <div className="details">
                        <p className="testimonial-name">{name}</p>
                        <p className="testimonial-position">{position}</p>
                      </div>
                      <div className="testimonial-image">
                        <img src={IMG} alt="" />
                      </div>
                    </div>
                    <p className="testimonial-text">{text}</p>
                  </div>
                );
              })}
            </div>
            <div className="w-full flex justify-end">
              <button
                className="prod-btn-lg prod-btn-secondary flex items-center justify-center me-[20px] h-[48px]"
                disabled={!(testimonialPage > 1)}
                onClick={() => {
                  if (testimonialPage > 1) {
                    setTestimonialPage(
                      (testimonialPage) => testimonialPage - 1
                    );
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
                disabled={!(testimonialPage < testimonials.length / 2)}
                onClick={() => {
                  if (testimonialPage < testimonials.length / 2)
                    setTestimonialPage(
                      (testimonialPage) => testimonialPage + 1
                    );
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
export default AboutUs;
