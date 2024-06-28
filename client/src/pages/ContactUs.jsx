import HomeFooter from "../components/HomeFooter";
import HomeNavbar from "../components/HomeNavbar";
import Icon from "../components/Icon";
import ContactDetailItem from "../components/about-us/ContactDetailItem";

const ContactUs = () => {
  const contactDetails = [
    {
      icon: "Mail",
      iconFill: true,
      label: "Email",
      desc: "HealthPH is here to communicate!",
      linkText: "example@gmail.com",
      link: "mailto:example@gmail.com",
    },
    {
      icon: "Location",
      iconFill: false,
      label: "Venue",
      desc: "Visit our place.",
      linkText: "HealthPH Research Laboratory Room 512",
      link: "https://national-u.edu.ph",
    },
  ];
  return (
    <div className="contact-us-layout">
      <HomeNavbar background="solid" />
      <div className="contact-us-container">
        <div className="contact-us-wrapper">
          <p className="heading">Contact Us</p>

          {/* MAP */}
          <div className="map-wrapper">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.9079096720375!2d120.99204841073136!3d14.604321576926559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c9fc11a6ceb3%3A0x9d4220dade0140ab!2sNational%20University-Manila!5e0!3m2!1sen!2sph!4v1719564264995!5m2!1sen!2sph"
              height="500"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            ></iframe>
          </div>

          {/* CONTACT DETAILS */}
          <div className="contact-details">
            {contactDetails.map((v, i) => {
              const { icon, iconFill, label, desc, link, linkText } = v;

              return (
                <ContactDetailItem
                  key={i}
                  icon={icon}
                  iconFill={iconFill}
                  label={label}
                  desc={desc}
                  link={link}
                  linkText={linkText}
                />
              );
            })}
          </div>
        </div>
      </div>
      <HomeFooter />
    </div>
  );
};
export default ContactUs;
