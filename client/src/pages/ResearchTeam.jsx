import HomeNavbar from "../components/HomeNavbar";
import TestimonialsList from "../assets/data/testimonials.json";
import TestimonialItem from "../components/about-us/TestimonialItem";
import HomeFooter from "../components/HomeFooter";

const ResearchTeam = () => {
  const dostPCHRD = TestimonialsList["dost-pchrd"];
  const researchTeam = TestimonialsList["research-team"];
  const interns = TestimonialsList["interns"];

  return (
    <div className="article-layout">
      <HomeNavbar />

      <section className="mt-[56px]">
        <div className="about-container">
          <div className="w-full max-w-[1144px]">
            <p className="section-title">DOST-PCHRD Officials</p>
            <div className="testimonials">
              {dostPCHRD.map((v, i) => {
                return <TestimonialItem {...v} key={i} />;
              })}
            </div>
            <p className="section-title">Research Team</p>
            <div className="testimonials">
              {researchTeam.map((v, i) => {
                return <TestimonialItem {...v} key={i} />;
              })}
            </div>
            {/* <p className="section-title">Interns</p>
            <div className="testimonials">
              {interns.map((v, i) => {
                return <TestimonialItem {...v} key={i} />;
              })}
            </div> */}
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
};
export default ResearchTeam;
