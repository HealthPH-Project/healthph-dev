import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import Icon from "../components/Icon";
import HomeNavbar from "../components/HomeNavbar";
import HomeFooter from "../components/HomeFooter";
import ArticleItem from "../components/about-us/ArticleItem";

import ArticlesList from "../assets/data/articles.json";

const AboutUs3 = () => {
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
    <div className="article-layout about-us flex flex-col min-h-[100vh]">
      <HomeNavbar background="solid" />

      <section className="mt-[56px] flex-grow">
        <div className="about-container mb-[112px]">
          <div className="w-full max-w-[1144px]">
            <p className="section-title !text-gray-700">About the Project</p>
            <div className="article-body text-gray-700">
              <p className="text-justify">
                <span>
                  The{" "}
                  <a
                    href="https://www.pchrd.dost.gov.ph/about-pchrd/"
                    className="underline underline-offset-2"
                    target="_blank"
                  >
                    Department of Science and Technology — Philippine Council
                    for Health Research and Development (DOST-PCHRD)
                  </a>
                  , through the Grants-in-Aid (GIA) Program, has recently
                  approved{" "}
                  <a
                    href="https://national-u.edu.ph/"
                    className="underline underline-offset-2"
                    target="_blank"
                  >
                    National University
                  </a>
                  's research proposal to promote public health surveillance in
                  the Philippines.{" "}
                </span>
                <br /> <br />
                <span>
                  In an era where digital footprints are ubiquitous, the fusion
                  of social media and public health surveillance represents a
                  groundbreaking advancement. The project, HealthPH: Intelligent
                  Disease Surveillance using Social Media, is an innovative
                  project aimed at revolutionizing disease surveillance and
                  public health management in the Philippines through the
                  intelligent use of social media. It spans 12 months from
                  October 2023 to September 2024. The initiative is primarily
                  applied research, focusing on the health sector and aligning
                  with the United Nations Sustainable Development Goal 3: Good
                  Health and Well-being.{" "}
                </span>
                <br /> <br />
                <span>
                  The HealthPH project, led by Dr. Mideth B. Abisado at National
                  University Philippines , epitomizes this innovative approach.
                  With the advent of COVID-19, the importance of early detection
                  and real-time monitoring of infectious diseases has become
                  paramount. The project's primary objective is to develop and
                  deploy an advanced system that leverages social media data to
                  detect and monitor symptoms towards probable disease
                  outbreaks. HealthPH aims to provide timely and accurate
                  information to health authorities, enabling them to respond
                  swiftly and effectively to emerging public health threats.{" "}
                </span>
                <br /> <br />
                <span>
                  The project aims to detect trends in social media posts about
                  emerging infectious diseases in the Philippines, particularly
                  in low-resourced languages, Filipino and Cebuano. As of date,
                  the HealthPH Toolkit is in its development stages. It aspires
                  to assists health professionals, officials, and the public in
                  making informed decisions. This innovative approach promises
                  to mitigate the risk of outbreaks and reduce economic and
                  social disruptions.{" "}
                </span>
                <br /> <br />
                <span>
                  The HealthPH project is poised to have significant social and
                  economic impacts. By providing real-time insights into disease
                  trends, the project can help health officials and policymakers
                  make informed decisions, potentially preventing outbreaks and
                  minimizing economic disruptions. The project also aims to
                  enhance public health services and preparedness, ultimately
                  contributing to better health outcomes for all Filipinos.{" "}
                </span>
                <br /> <br />
                <span>
                  National University's vision of dynamic Filipinism and
                  nation-building is embodied in initiatives like this. By
                  strengthening our collective capabilities in health and
                  medicine, social computing, e-governance, and Artificial
                  Intelligence, we further our commitment to shaping a future
                  where technology and culture are intertwined and where the
                  digital world speaks, understands, and celebrates our
                  languages.{" "}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
};

export default AboutUs3;
