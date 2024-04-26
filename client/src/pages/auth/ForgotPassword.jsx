import { useState } from "react";
import FieldGroup from "../../components/FieldGroup";
import Input from "../../components/Input";
import { NavLink } from "react-router-dom";
import { useForgotPasswordMutation } from "../../features/api/authAPISlice";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [formErrors, setFormErrors] = useState({ email: "" });
  const [linkSent, setLinkSent] = useState(false);

  const [forgotPassword] = useForgotPasswordMutation();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.email.trim().length == 0) {
      setFormErrors({ ...formErrors, email: "Must enter email address" });
      return;
    }

    setIsLoading(true);
    const response = await forgotPassword(formData.email);

    if (!response) {
      console.log("Error finding user.");
      setIsLoading(false);
      return;
    }

    if ("error" in response) {
      setIsLoading(false);
      const { data } = response["error"];
      setFormErrors({ ...formErrors, email: data["detail"] });
      return;
    }

    setLinkSent(!linkSent);
    setIsLoading(false);
  };
  return !linkSent ? (
    <>
      <p className="heading">Forgot Password</p>
      <p className="subheading">
        Provide your email address that you are using in HealthPH to reset your
        password.
      </p>
      <form method="post" onSubmit={handleSubmit}>
        <FieldGroup
          label="Email"
          labelFor="email"
          additionalClasses="w-full mb-[20px]"
          caption={formErrors.email != "" ? formErrors.email : ""}
          state={formErrors.email != "" ? "error" : ""}
        >
          <Input
            size="input-md"
            id="email"
            type="email"
            additionalClasses="w-full mt-[8px]"
            placeholder="Enter email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              setFormErrors({ ...formErrors, email: "" });
            }}
            state={formErrors.email != "" ? "error" : ""}
            required
          />
        </FieldGroup>
        <button
          type="submit"
          className="prod-btn-base prod-btn-primary w-full mt-[4px] mb-[32px]"
          disabled={isLoading}
        >
          Forgot Password
        </button>
        <p className="text-center">
          <span className=" prod-p2 text-gray-700 font-medium">
            Remember your password?
          </span>
          <NavLink to="/login"> Sign In</NavLink>
        </p>
      </form>
    </>
  ) : (
    <>
      <p className="heading">Reset Password Link Sent</p>
      <p className="subheading">
        Follow the password reset instructions we sent to {formData.email}.
      </p>
      <NavLink
        to="/login"
        className="prod-btn-base prod-btn-primary w-full text-center"
      >
        Back to Sign in
      </NavLink>
    </>
  );
};
export default ForgotPassword;
