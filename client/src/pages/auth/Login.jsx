import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useAuthenticateMutation } from "../../features/api/authAPISlice";
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

  return (
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
  );
};
export default Login;
