import { useState } from "react";
import HomeFooter from "../components/HomeFooter";
import HomeNavbar from "../components/HomeNavbar";
import Icon from "../components/Icon";
import ContactDetailItem from "../components/about-us/ContactDetailItem";
import FieldGroup from "../components/FieldGroup";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import { useSendContactUsMutation } from "../features/api/miscSlice";

const ContactUs = () => {
  const contactDetails = [
    {
      icon: "Mail",
      iconFill: true,
      label: "Email",
      desc: "HealthPH is here to communicate!",
      linkText: import.meta.env.VITE_HEALTHPH_EMAIL,
      link: "mailto:" + import.meta.env.VITE_HEALTHPH_EMAIL,
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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [isMessageSent, setIsMessageSent] = useState(false);

  const [sendMessage] = useSendContactUsMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!checkError()) {
      // if (true) {
      setIsLoading(true);
      const response = await sendMessage(formData);

      if (!response) {
        setError("Failed to send message. Please try again later.");
        setIsLoading(false);
        return;
      }

      if ("error" in response) {
        const { detail } = response["error"]["data"];

        detail.map(({ field, error }, i) => {
          if (field in formData) {
            setFormErrors((formErrors) => ({
              ...formErrors,
              [field]: error,
            }));
          }

          if (field == "error") {
            setError(error);
          }
        });

        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setError("");
      setIsMessageSent(true);
    }
  };

  const checkError = () => {
    let flag = false;

    if (formData.name == "" || formData.name.trim().length == 0) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        name: "Must provide name.",
      }));
      flag = true;
    }

    const validEmail =
      /^([a-z0-9]+[a-z0-9!#$%&'*+/=?^_`{|}~-]?(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/;

    if (formData.email == "" || formData.email.trim().length == 0) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        email: "Must provide email address.",
      }));
      flag = true;
    } else if (!validEmail.test(formData.email)) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        email: "Must provide valid email address.",
      }));
      flag = true;
    }

    if (formData.subject == "" || formData.subject.trim().length == 0) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        subject: "Must provide subject.",
      }));
      flag = true;
    }

    if (formData.message == "" || formData.message.trim().length == 0) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        message: "Must provide message.",
      }));
      flag = true;
    }

    return flag;
  };

  return (
    <div className="contact-us-layout flex flex-col min-h-[100vh]">
      <HomeNavbar background="solid" />
      <div className="contact-us-container flex-grow">
        <div className="contact-us-wrapper">
          <p className="heading">Contact Us</p>
          <div className="contact-us-grid">
            {/* FORM */}
            <div className="form-wrapper">
              {isMessageSent ? (
                <>
                  <p className="web-m-h5 sm:web-d-h5 text-gray-900 mb-[8px]">
                    Your message has been sent!
                  </p>
                  <p className="web-m-p3 sm:web-d-p3 text-gray-700 mb-[32px]">
                    Thank you for reaching us out!. We will contact you once the
                    team has read your message!
                  </p>
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      className=" prod-btn-base prod-btn-primary"
                      onClick={() => setIsMessageSent(false)}
                    >
                      Send another message
                    </button>
                  </div>
                </>
              ) : (
                <form method="POST" onSubmit={handleSubmit}>
                  {error && (
                    <p className="prod-p4 text-[#D82727] mb-[8px]">{error}</p>
                  )}
                  <FieldGroup
                    label="Name*"
                    labelFor="name"
                    additionalClasses="w-full mb-[24px]"
                    caption={formErrors.name != "" ? formErrors.name : ""}
                    state={formErrors.name != "" ? "error" : ""}
                  >
                    <Input
                      size="input-base sm:input-lg"
                      id="name"
                      type="text"
                      additionalClasses="w-full mt-[8px]"
                      placeholder="Enter name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        setFormErrors({ ...formErrors, name: "" });
                        setError("");
                      }}
                      state={formErrors.name != "" ? "error" : ""}
                      // required
                    />
                  </FieldGroup>
                  <FieldGroup
                    label="Email*"
                    labelFor="email"
                    additionalClasses="w-full mb-[24px]"
                    caption={formErrors.email != "" ? formErrors.email : ""}
                    state={formErrors.email != "" ? "error" : ""}
                  >
                    <Input
                      size="input-base sm:input-lg"
                      id="email"
                      type="email"
                      additionalClasses="w-full mt-[8px]"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        setFormErrors({ ...formErrors, email: "" });
                        setError("");
                      }}
                      state={formErrors.email != "" ? "error" : ""}
                      // required
                    />
                  </FieldGroup>
                  <FieldGroup
                    label="Subject*"
                    labelFor="subject"
                    additionalClasses="w-full mb-[24px]"
                    caption={formErrors.subject != "" ? formErrors.subject : ""}
                    state={formErrors.subject != "" ? "error" : ""}
                  >
                    <Input
                      size="input-base sm:input-lg"
                      id="subject"
                      type="text"
                      additionalClasses="w-full mt-[8px]"
                      placeholder="Enter subject"
                      value={formData.subject}
                      onChange={(e) => {
                        setFormData({ ...formData, subject: e.target.value });
                        setFormErrors({ ...formErrors, subject: "" });
                        setError("");
                      }}
                      state={formErrors.subject != "" ? "error" : ""}
                      // required
                    />
                  </FieldGroup>
                  <FieldGroup
                    label="Message*"
                    labelFor="message"
                    additionalClasses="w-full mb-[24px]"
                    caption={formErrors.message != "" ? formErrors.message : ""}
                    state={formErrors.message != "" ? "error" : ""}
                  >
                    <div className="input-textarea-wrapper mt-[8px] w-full">
                      <textarea
                        className={`input-textarea input-textarea-base sm:input-textarea-lg w-full h-[116px] ${
                          formErrors.message != "" ? "input-error" : ""
                        }`}
                        id="message"
                        placeholder="Enter message"
                        onChange={(e) => {
                          setFormData({ ...formData, message: e.target.value });
                          setFormErrors({ ...formErrors, message: "" });
                          setError("");
                        }}
                        value={formData.message}
                      ></textarea>
                    </div>
                  </FieldGroup>
                  <div className="flex items-center justify-end pt-[8px]">
                    <button
                      type="submit"
                      className="prod-btn-base prod-btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* MAP */}
            <div className="map-wrapper">
              {/* <div className="map-label-wrapper">
                <div className="map-label-container">
                  <p className="label">Facility</p>
                  <p className="description">Visit our room.</p>
                  <a href="#" className="link">
                    HealthPH Research Laboratory Room 512
                  </a>
                </div>
              </div> */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3860.9057303038553!2d120.9918691!3d14.6044457!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c938e533ffef%3A0x20cbe9eca9350ae5!2sHealthPH!5e0!3m2!1sen!2sph!4v1720681932028!5m2!1sen!2sph"
                height="500"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <HomeFooter />
    </div>
  );
};
export default ContactUs;
