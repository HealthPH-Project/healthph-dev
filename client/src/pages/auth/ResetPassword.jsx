import { useEffect, useState } from "react";
import FieldGroup from "../../components/FieldGroup";
import InputPassword from "../../components/InputPassword";
import Icon from "../../components/Icon";
import PasswordRequirements from "../../components/auth/PasswordRequirements";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
  useResetPasswordMutation,
  useVerifyResetPasswordMutation,
} from "../../features/api/authAPISlice";

const ResetPassword = () => {
  const { token } = useParams();

  const [formData, setFormData] = useState({
    token: token,
    password: "",
    re_password: "",
  });

  const [formErrors, setFormErrors] = useState({
    password: "",
    re_password: "",
  });

  const [error, setError] = useState("");

  const [pwdFlags, setPWDFlags] = useState({
    length: "",
    lowercase: "",
    uppercase: "",
    number: "",
    character: "",
  });

  const [resetSuccessful, setResetSuccessful] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [linkValid, setLinkValid] = useState(false);

  const [verifyResetPassword] = useVerifyResetPasswordMutation();

  const [resetPassword] = useResetPasswordMutation();

  const navigate = useNavigate();

  useEffect(() => {
    const handleVerify = async () => {
      const response = await verifyResetPassword(token);

      if (!response) {
        console.log("Error verifyng reset password link.");
        return;
      }

      if ("error" in response) {
        setLinkValid(false);
        setIsLoading(false);

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
        return;
      }

      setLinkValid(true);
      setIsLoading(false);
    };
    handleVerify();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkError()) {
      const response = await resetPassword(formData);
      if (!response) {
        console.log("Error resetting password.");
        return;
      }
      if ("error" in response) {
        console.log(response);
        const { data } = response["error"];
        setError(data["detail"]);
        return;
      }

      setResetSuccessful(true);
    }
  };

  const checkError = () => {
    let flag = false;

    if (formData.password == "" || formData.password.trim().length == 0) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        password: "Must enter new password.",
      }));
      flag = true;
    } else {
      for (const key in pwdFlags) {
        if (pwdFlags[key] != "success") {
          setFormErrors((formErrors) => ({
            ...formErrors,
            password: "Must follow the following requirements.",
          }));
          flag = true;
          break;
        }
      }
    }

    if (formData.re_password == "" || formData.re_password.trim().length == 0) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        re_password: "Must confirm new password.",
      }));
      flag = true;
    } else if (formData.password != formData.re_password) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        re_password: "Passwords do not match.",
      }));
      flag = true;
    }

    return flag;
  };

  return isLoading ? (
    <p>Loading....</p>
  ) : !linkValid ? (
    <>
      <p className="heading">Reset Password Link has Expired or is Invalid</p>
      <p className="subheading">
        You will be redirected to the sign in page shortly.
      </p>
    </>
  ) : !resetSuccessful ? (
    <>
      <p className="heading">Reset Password</p>
      <p className="subheading">
        Provide your new password to continue using your account.
      </p>
      {error && <p className="prod-p4  text-[#D82727] mb-[8px]">{error}</p>}
      <form method="post" onSubmit={handleSubmit}>
        <FieldGroup
          label="New Password"
          labelFor="password"
          additionalClasses="w-full mb-[8px]"
          caption={formErrors.password != "" ? formErrors.password : ""}
          state={formErrors.password != "" ? "error" : ""}
        >
          <InputPassword
            size="input-md"
            id="password"
            additionalClasses="w-full mt-[8px]"
            placeholder="Enter new password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              setFormErrors({ ...formErrors, password: "" });
              setError("");
            }}
            state={formErrors.password != "" ? "error" : ""}
            // required
          />
        </FieldGroup>
        <PasswordRequirements
          password={formData.password}
          pwdFlags={pwdFlags}
          handleChange={setPWDFlags}
        />
        <FieldGroup
          label="Confirm Password"
          labelFor="re-password"
          additionalClasses="w-full mb-[8px]"
          caption={formErrors.re_password != "" ? formErrors.re_password : ""}
          state={formErrors.re_password != "" ? "error" : ""}
        >
          <InputPassword
            size="input-md"
            id="re-password"
            additionalClasses="w-full mt-[8px]"
            placeholder="Re-enter password"
            value={formData.re_password}
            onChange={(e) => {
              setFormData({ ...formData, re_password: e.target.value });
              setFormErrors({ ...formErrors, re_password: "" });
              setError("");
            }}
            caption="An error message an error message an error message"
            state={formErrors.re_password != "" ? "error" : ""}
            // required
          />
        </FieldGroup>
        <button
          type="submit"
          className="prod-btn-base prod-btn-primary w-full mt-[20px] mb-[32px]"
        >
          Reset Password
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
      <p className="heading">Password Updated</p>
      <p className="subheading">
        Your password has successfully been updated. You may now sign in to your
        account.
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
export default ResetPassword;
