import { Link, useParams } from "react-router-dom";
import HomeNavbar from "../components/HomeNavbar";
import { useEffect } from "react";
import HomeFooter from "../components/HomeFooter";
import IMG from "../assets/images/about-bg.png";
import Icon from "../components/Icon";
const ArticlePage = () => {
  const { slug } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="article-layout">
      <HomeNavbar />
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
              <p className="article-title">
                Your Window into Public Health Trends in the Philippines
              </p>
              <p className="article-content my-[24px]">
                3 minutes • January 1, 2024
              </p>
              <p className="article-content">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Veniam, quia labore nisi a non facilis in magnam maiores
                corrupti voluptatibus ullam? Eius velit beatae enim error id
                aperiam eaque cum?
              </p>
            </div>
            <div className="article-preview">
              <div className="article-image-wrapper">
                <img src={IMG} alt="" />
              </div>
              <p className="article-caption">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptate, omnis?
              </p>
            </div>

            <div className="article-body">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Id
                adipisci odit sapiente molestias voluptatum maiores
                necessitatibus optio? Maxime quis voluptates iusto saepe animi
                sed eum adipisci nisi pariatur, dolorem facilis dicta sunt
                aliquam commodi quas incidunt, rem blanditiis debitis in natus
                aspernatur dolorum ducimus. Velit iure, repellendus repudiandae
                nulla nesciunt quia quasi exercitationem enim sit distinctio
                architecto est porro id?
                <br /> <br />
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Neque
                distinctio sapiente voluptatum, ex fugit corporis aperiam
                commodi. Omnis dolorem nisi ab explicabo, quae at soluta?
                <br /> <br />
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quibusdam nihil nostrum minus sapiente necessitatibus impedit
                corrupti odit, quia maiores dolore veniam itaque eaque nemo
                beatae ea, molestiae officiis. Repellendus nulla similique
                ducimus ratione quaerat veritatis debitis, animi consequuntur,
                ea ullam fugit omnis enim libero, deserunt mollitia! Sit beatae
                id quam modi ratione, laborum qui esse ipsum nam perspiciatis
                dolore iusto? Consequuntur, soluta laudantium. Voluptates
                possimus dolores, dolor numquam similique odio aspernatur
                delectus, ipsam excepturi iure blanditiis dicta praesentium
                porro tempore quibusdam! Rerum est cumque blanditiis. Unde
                asperiores assumenda ad expedita amet eum, veniam saepe
                repudiandae. Saepe rem voluptate odio architecto? Pariatur dolor
                magnam accusantium tenetur, reiciendis corrupti quia animi
                laudantium quae natus culpa architecto porro autem. Eum
                aspernatur eaque omnis similique reprehenderit quaerat ducimus
                neque, odit, reiciendis impedit rerum nobis fugiat explicabo est
                deserunt! Itaque cupiditate consequatur ex sunt odit? Distinctio
                nisi ab deserunt cupiditate iusto? Dolorum veniam magni
                perspiciatis adipisci tempora laborum, praesentium perferendis
                omnis ad deserunt iusto quos reiciendis! Cupiditate voluptates
                molestias excepturi, inventore veniam voluptatum quibusdam
                praesentium sapiente odio ducimus omnis eius soluta libero
                deserunt reiciendis laborum reprehenderit hic adipisci officia
                sit. Accusamus nemo atque sunt vel maiores quae voluptate quo
                temporibus? Temporibus debitis dolorum nisi corporis?
                <br /> <br />
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestias, ratione atque itaque mollitia placeat expedita
                explicabo distinctio, sed suscipit tenetur, aspernatur vel
                accusantium quas sapiente omnis ex modi. Suscipit ducimus nam ea
                itaque nulla laudantium reprehenderit dolores a odio corrupti.
                <br /> <br />
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui
                quae deleniti quam repudiandae eos eveniet?
              </p>
            </div>

            <div className="article-gallery">
              {Array.from({ length: 8 }).map((v, i) => {
                return (
                  <div className="gallery-item" key={i}>
                    <div className="image-wrapper">
                      <img src={IMG} alt="" />
                    </div>
                    <p className="article-caption">
                      Lorem ipsum dolor sit amet.
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
};
export default ArticlePage;
