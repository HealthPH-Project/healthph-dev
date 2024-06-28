const TestimonialItem2 = ({ name, position, image, testimonial }) => {
  return (
    <div className="testimonial-item2">
      <div className="testimonial-image-wrapper">
        {image && <img src={"/assets/research-team/" + image} alt={name} />}
      </div>
      <div className="testimonial-body">
        <div className="mb-[12px]">
          <p className="testimonial-name">{name}</p>
          <p className="testimonial-position">{position}</p>
        </div>
        <p className="testimonial-text">{testimonial}</p>
      </div>
    </div>
  );
};
export default TestimonialItem2;
