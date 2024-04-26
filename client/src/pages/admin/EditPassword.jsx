import { NavLink, useNavigate } from "react-router-dom";
import Icon from "../../components/Icon";
import { useState } from "react";
import InputPassword from "../../components/InputPassword";
import FieldGroup from "../../components/FieldGroup";
import PasswordRequirements from "../../components/auth/PasswordRequirements";
import { useUpdatePasswordMutation } from "../../features/api/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import Snackbar from "../../components/Snackbar";

const EditPassword = () => {
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    id: user.id,
    current_password: "",
    password: "",
    re_password: "",
  });

  const [formErrors, setFormErrors] = useState({
    current_password: "",
    password: "",
    re_password: "",
  });

  const [pwdFlags, setPWDFlags] = useState({
    length: "",
    lowercase: "",
    uppercase: "",
    number: "",
    character: "",
  });

  const [updatePassword] = useUpdatePasswordMutation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkError()) {
      setIsLoading(true);
      const response = await updatePassword(formData);

      if (!response) {
        toast(
          <Snackbar
            iconName="Error"
            size="snackbar-sm"
            color="destructive"
            message="Updating password failed"
          />,
          {
            closeButton: ({ closeToast }) => (
              <Icon
                iconName="Close"
                className="close-icon close-icon-sm close-destructive"
                onClick={closeToast}
              />
            ),
          }
        );
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

      dispatch(updateUser(response.data));

      localStorage.removeItem("auth");

      localStorage.setItem(
        "auth",
        JSON.stringify({ user: response.data.user })
      );

      setIsLoading(false);

      toast(
        <Snackbar
          iconName="CheckCircle"
          size="snackbar-sm"
          color="success"
          message="Password updated successfully"
        />,
        {
          closeButton: ({ closeToast }) => (
            <Icon
              iconName="Close"
              className="close-icon close-icon-sm close-success"
              onClick={closeToast}
            />
          ),
        }
      );

      navigate("/dashboard/settings", { replace: true });
    }
  };

  const checkError = () => {
    let flag = false;
    if (
      formData.current_password == "" ||
      formData.current_password.trim().length == 0
    ) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        current_password: "Must enter current password.",
      }));
      flag = true;
    }

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

    if (formData.re_password == "" || formData.re_password.trim().length == 0) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        re_password: "Must confirm new password.",
      }));
      flag = true;
    } else {
      if (formData.password != formData.re_password) {
        setFormErrors((formErrors) => ({
          ...formErrors,
          re_password: "Passwords do not match.",
        }));
        flag = true;
      }
    }

    return flag;
  };
  return (
    <>
      <div className="admin-wrapper flex flex-col h-full">
        <div className="header">
          <div className="breadcrumbs-wrapper">
            <div className="breadcrumb-item">
              <NavLink to="/dashboard/settings" end>
                Settings
              </NavLink>
              <Icon
                iconName="ChevronRight"
                height="16px"
                width="16px"
                fill="#A1ACB8"
                className="icon"
              />
            </div>
            <div className="breadcrumb-item">
              <NavLink to="/dashboard/settings/edit-password">
                Edit Password
              </NavLink>
              <Icon
                iconName="ChevronRight"
                height="16px"
                width="16px"
                fill="#A1ACB8"
                className="icon"
              />
            </div>
          </div>
        </div>

        <form method="post" onSubmit={handleSubmit}>
          <div className="settings-header">
            <div>
              <p>Edit Password</p>
              <span>Provide a new password to secure your account.</span>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                className="prod-btn-base prod-btn-secondary me-[16px]"
                onClick={() => {
                  navigate("/dashboard/settings", { replace: true });
                }}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="prod-btn-base prod-btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
          {error && <p className="prod-p4  text-[#D82727] mb-[8px]">{error}</p>}
          <FieldGroup
            label="Current Password"
            labelFor="current_password"
            additionalClasses="w-full max-w-[360px] mb-[20px]"
            caption={
              formErrors.current_password != ""
                ? formErrors.current_password
                : ""
            }
            state={formErrors.current_password != "" ? "error" : ""}
          >
            <InputPassword
              size="input-md"
              id="current_password"
              additionalClasses="w-full  mt-[8px]"
              placeholder="Enter current password"
              value={formData.current_password}
              onChange={(e) => {
                setFormData({ ...formData, current_password: e.target.value });
                setFormErrors({ ...formErrors, current_password: "" });
                setError("");
              }}
              state={formErrors.current_password != "" ? "error" : ""}
            />
          </FieldGroup>
          <FieldGroup
            label="New Password"
            labelFor="password"
            additionalClasses="w-full max-w-[360px] mb-[20px]"
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
            additionalClasses="w-full max-w-[360px] mb-[20px]"
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
            />
          </FieldGroup>
        </form>
      </div>
    </>
  );
};
export default EditPassword;
