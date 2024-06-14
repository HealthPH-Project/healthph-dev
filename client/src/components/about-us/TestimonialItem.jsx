const TestimonialItem = ({ name, position, image, testimonial }) => {
  return (
    <div className="testimonial-item">
      <div className="testimonial-header">
        <div className="details">
          <p className="testimonial-name">{name}</p>
          <p className="testimonial-position">{position}</p>
        </div>
        <div className="testimonial-image">
          {image && <img src={"/assets/research-team/" + image} alt={name} />}
        </div>
      </div>
      <p className="testimonial-text">{testimonial}</p>
    </div>
  );
};
export default TestimonialItem;
