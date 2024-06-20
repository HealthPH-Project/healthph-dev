import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  useAuthenticateMutation,
  useResendCodeMutation,
  useVerifyCodeMutation,
} from "../../features/api/authAPISlice";
import { useCreateActivityLogMutation } from "../../features/api/activityLogsSlice";
import {
  authenticateUser,
  updateInitialLogin,
} from "../../features/auth/authSlice";

import Cookies from "js-cookie";
import FieldGroup from "../../components/FieldGroup";
import Input from "../../components/Input";
import InputPassword from "../../components/InputPassword";
import Checkbox from "../../components/Checkbox";
import useDeviceDetect from "../../hooks/useDeviceDetect";

const Login = () => {
  const { isPWA } = useDeviceDetect();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [remember, setRemember] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [authenticate] = useAuthenticateMutation();

  const [log_activity] = useCreateActivityLogMutation();

  const dispatch = useDispatch();

  const location = useLocation().state;

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkError()) {
      setIsLoading(true);
      setError("");
      const response = await authenticate(formData);

      if (!response) {
        console.log("Error authenticating user...");
        setIsLoading(false);
        return;
      }

      if ("error" in response) {
        setIsLoading(false);
        const { data, error } = response["error"];

        if (data) {
          setError(data["detail"]);
        } else if (error) {
          setError("Failed to sign in. Please try again later.");
        }
        return;
      }

      console.log(response.data);
      if (response.data.otp_code_sent) {
        setOtpCodeSent(true);
      }
    }
  };

  const checkError = () => {
    let flag = false;

    if (formData.email == "" || formData.email.trim().length == 0) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        email: "Must enter email address.",
      }));
      flag = true;
    }

    if (formData.password == "" || formData.password.trim().length == 0) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        password: "Must enter password.",
      }));
      flag = true;
    }

    return flag;
  };
  const [otpCodeSent, setOtpCodeSent] = useState(false);

  useEffect(() => {
    const unloadCallback = (e) => {
      if (otpCodeSent) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, [otpCodeSent]);

  return !otpCodeSent ? (
    <>
      <p className="heading">Welcome Back!</p>
      <p className="subheading">Provide your credentials to start tracking!</p>
      {error && <p className="prod-p4  text-[#D82727] mb-[8px]">{error}</p>}
      <form method="POST" onSubmit={handleSubmit}>
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
              setError("");
            }}
            state={formErrors.email != "" ? "error" : ""}
          />
        </FieldGroup>
        <FieldGroup
          label="Password"
          labelFor="password"
          additionalClasses="w-full"
          caption={formErrors.password != "" ? formErrors.password : ""}
          state={formErrors.password != "" ? "error" : ""}
        >
          <InputPassword
            size="input-md"
            id="password"
            additionalClasses="w-full mt-[8px]"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              setFormErrors({ ...formErrors, password: "" });
              setError("");
            }}
            state={formErrors.password != "" ? "error" : ""}
          />
        </FieldGroup>
        <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center my-[24px]">
          {/* <Checkbox
            name="remember"
            id="remember"
            label="Remember Me"
            checked={remember}
            handleChange={setRemember}
            size="input-checkbox-md"
            additionalClasses="items-center"
          /> */}
          <NavLink to="/forgot-password" className="mb-0 sm:mb-0">
            Forgot Password
          </NavLink>
        </div>
        <button
          type="submit"
          className="prod-btn-base prod-btn-primary w-full mb-[16px]"
          disabled={isLoading}
        >
          {isLoading ? "Signing in...." : "Sign In"}
        </button>
        {!isPWA && (
          <Link
            to="/"
            role="button"
            className="block prod-btn-base prod-btn-secondary w-full"
            disabled={isLoading}
          >
            Back to Home
          </Link>
        )}
      </form>
    </>
  ) : (
    <OTPCode email={formData.email} />
  );
};

const OTPCode = ({ email }) => {
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    otp_code: "",
    email: email,
  });
  const [formErrors, setFormErrors] = useState({ otp_code: "" });

  const [isLoading, setIsLoading] = useState(false);

  const [isResendLoading, setIsResendLoading] = useState(false);

  const [verifyCode] = useVerifyCodeMutation();

  const [resendCode] = useResendCodeMutation();

  const [log_activity] = useCreateActivityLogMutation();

  const dispatch = useDispatch();

  const location = useLocation().state;

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkError()) {
      setIsLoading(true);
      setError("");

      const response = await verifyCode(formData);

      if (!response) {
        console.log("Error verifying code...");
        setIsLoading(false);
        return;
      }
      if ("error" in response) {
        setIsLoading(false);
        const { data, error } = response["error"];

        if (data) {
          setError(data["detail"]);
        } else if (error) {
          setError("Failed to verify code. Please try again later.");
        }
        return;
      }

      if (["SUPERADMIN", "ADMIN"].includes(response.data.user.user_type)) {
        await log_activity({
          user_id: response.data.user.id,
          entry: "Login",
          module: "Log In",
        });
      }

      dispatch(authenticateUser(response.data));

      dispatch(updateInitialLogin({ value: true }));

      Cookies.set("token", response.data.access_token);

      localStorage.setItem(
        "auth",
        JSON.stringify({ user: response.data.user })
      );

      const previousPath = location ? location.from.pathname : "/dashboard";

      setIsLoading(false);

      navigate(previousPath, { replace: true });
    }
  };

  const checkError = () => {
    let flag = false;

    if (formData.otp_code == "" || formData.otp_code.trim().length == 0) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        otp_code: "Must enter verification code.",
      }));
      flag = true;
    }

    return flag;
  };

  const [secsLeft, setSecsLeft] = useState(15);

  useEffect(() => {
    const timerId = setInterval(() => {
      if (secsLeft > 0) {
        setSecsLeft(secsLeft - 1);
      } else {
        clearInterval(timerId);
      }
    }, 1000);

    // Cleanup function to clear the interval on unmount
    return () => clearInterval(timerId);
  }, [secsLeft]);

  const handleResend = async () => {
    setSecsLeft(15);
    setIsResendLoading(true);
    setError("");

    const response = await resendCode(email);

    if (!response) {
      console.log("Error resending code...");
      setIsLoading(false);
      return;
    }
    if ("error" in response) {
      setIsLoading(false);
      const { data, error } = response["error"];

      if (data) {
        setError(data["detail"]);
      } else if (error) {
        setError("Failed to resend OTP code. Please try again later.");
      }
      return;
    }
  };

  return (
    <>
      <p className="heading">2-Step Verification </p>
      <p className="subheading">
        An email with a 6-digit verification code was just sent to {email}.
      </p>
      {error && <p className="prod-p4  text-[#D82727] mb-[8px]">{error}</p>}
      <form method="post" onSubmit={handleSubmit}>
        <FieldGroup
          label="Verification Code"
          labelFor="code"
          additionalClasses="w-full mb-[20px]"
          caption={formErrors.otp_code != "" ? formErrors.otp_code : ""}
          state={formErrors.otp_code != "" ? "error" : ""}
        >
          <Input
            size="input-md"
            id="code"
            type="text"
            additionalClasses="w-full mt-[8px]"
            placeholder="Enter verification code"
            value={formData.otp_code}
            onChange={(e) => {
              setFormData({ ...formData, otp_code: e.target.value });
              setFormErrors({ ...formErrors, otp_code: "" });
              setError("");
            }}
            state={formErrors.otp_code != "" ? "error" : ""}
          />
        </FieldGroup>
        <button
          type="submit"
          className="prod-btn-base prod-btn-primary w-full mt-[4px] mb-[32px]"
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Verify"}
        </button>
        <p className="text-center">
          <span className=" prod-p2 text-gray-700 font-medium">
            Didn't receive it?
          </span>
          <a
            href="#"
            onClick={handleResend}
            className={secsLeft > 0 ? "light" : ""}
          >
            {" "}
            {secsLeft > 0 ? ` Resend in ${secsLeft} second(s)` : " Resend Code"}
          </a>
        </p>
      </form>
    </>
  );
};

export default Login;
