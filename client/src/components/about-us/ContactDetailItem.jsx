import Icon from "../Icon";

const ContactDetailItem = ({ icon, iconFill, label, desc, link, linkText }) => {
  return (
    <div className="contact-detail-item">
      <div className="contact-icon">
        <Icon
          iconName={icon}
          fill={iconFill ? "#007AFF" : "transparent"}
          stroke={iconFill ? "transparent" : "#007AFF"}
          className="icon"
          height="24px"
          width="24px"
        />
      </div>
      <div className="contact-detail">
        <p className="label">{label}</p>
        <p className="description">{desc}</p>
      </div>
      <div className="contact-link">
        <a href={link}>{linkText}</a>
      </div>
    </div>
  );
};
export default ContactDetailItem;
