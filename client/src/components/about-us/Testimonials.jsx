import { useState } from "react";
import IMG from "../../assets/images/home-bg.png";
import Icon from "../Icon";

import TestimonialsList from "../../assets/data/testimonials.json";

const Testimonials = () => {
  let testimonials = [
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

  testimonials = TestimonialsList["research-team"];

  const [testimonialPage, setTestimonialPage] = useState(1);

  const numOfTestimonialsPerPage = 2;

  const getTestimonials = () => {
    const startIndex = testimonialPage * 2;

    return testimonials.slice(startIndex - 2, startIndex);
  };

  return (
    <>
      <div className="testimonials">
        {getTestimonials().map(({ name, position, testimonial, image }, i) => {
          return (
            <div className="testimonial-item" key={i}>
              <div className="testimonial-header">
                <div className="details">
                  <p className="testimonial-name">{name}</p>
                  <p className="testimonial-position">{position}</p>
                </div>
                <div className="testimonial-image">
                  <img src={"/assets/research-team/" + image} alt={name} />
                </div>
              </div>
              <p className="testimonial-text">{testimonial}</p>
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
              setTestimonialPage((testimonialPage) => testimonialPage - 1);
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
              setTestimonialPage((testimonialPage) => testimonialPage + 1);
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
    </>
  );
};
export default Testimonials;
