import { NavLink, useNavigate } from "react-router-dom";
import Icon from "../../components/Icon";
import FieldGroup from "../../components/FieldGroup";
import { useState } from "react";
import { useSelector } from "react-redux";
import Input from "../../components/Input";
import CustomSelect from "../../components/CustomSelect";
import InputPassword from "../../components/InputPassword";
import PasswordRequirements from "../../components/auth/PasswordRequirements";
import { useCreateAdminMutation } from "../../features/api/userSlice";
import { useCreateActivityLogMutation } from "../../features/api/activityLogsSlice";

import { toast } from "react-toastify";
import Snackbar from "../../components/Snackbar";

const AddAdmin = () => {
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    user_type: "",
    department_level: "",
    organization: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    user_type: "",
    department_level: "",
    organization: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [pwdFlags, setPWDFlags] = useState({
    length: "",
    lowercase: "",
    uppercase: "",
    number: "",
    character: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const [createAdmin] = useCreateAdminMutation();

  const [log_activity] = useCreateActivityLogMutation();

  const navigate = useNavigate();

  const handleChangeUserType = (value) => {
    setFormData({ ...formData, user_type: value });
    setFormErrors((formErrors) => ({
      ...formErrors,
      user_type: "",
    }));
    setError("");
  };

  const handleChangeDepartment = (value) => {
    setFormData({ ...formData, department_level: value });
    setFormErrors((formErrors) => ({
      ...formErrors,
      department_level: "",
    }));
    setError("");
  };

  const generatePassword = () => {
    let pwd = "";
    const length = 10;

    let charset = "";
    charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    charset += "abcdefghijklmnopqrstuvwxyz";
    charset += "01234567890";
    charset += "!@#$%^&*-_";

    const specialChars = /^.*[!@#$%^&*_-]+.*$/;

    while (
      /\s/.test(pwd) ||
      !/[a-z]/.test(pwd) ||
      !/[A-Z]/.test(pwd) ||
      !/\d/.test(pwd) ||
      !specialChars.test(pwd)
    ) {
      pwd = "";
      for (let i = 0; i < length; i++) {
        pwd += charset.charAt(Math.floor(Math.random() * charset.length));
      }
    }

    setFormData((formData) => ({ ...formData, password: pwd }));
    setFormErrors((formErrors) => ({ ...formErrors, password: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkError()) {
      setIsLoading(true);

      const response = await createAdmin(formData);

      if (!response) {
        toast(
          <Snackbar
            iconName="Error"
            size="snackbar-sm"
            color="destructive"
            message="Failed to create admin"
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

          if (field == "snackbar") {
            toast(
              <Snackbar
                iconName="Error"
                size="snackbar-sm"
                color="destructive"
                message={error}
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
          }
        });

        setIsLoading(false);
        return;
      }

      toast(
        <Snackbar
          iconName="CheckCircle"
          size="snackbar-sm"
          color="success"
          message="Admin added successfully"
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

      await log_activity({
        user_id: user.id,
        entry: `Added ${formData.user_type} : ${formData.first_name} ${formData.last_name}`,
        module: "User Management",
      });

      navigate("/dashboard/user-management", { replace: true });
    }
  };

  const checkError = () => {
    let flag = false;

    if (formData.user_type == "") {
      setFormErrors((formErrors) => ({
        ...formErrors,
        user_type: "Must choose user type.",
      }));
      flag = true;
    }

    if (formData.department_level == "") {
      setFormErrors((formErrors) => ({
        ...formErrors,
        department_level: "Must choose department level.",
      }));
      flag = true;
    }

    if (
      formData.organization == "" ||
      formData.organization.trim().length == 0
    ) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        organization: "Must enter organization.",
      }));
      flag = true;
    }

    if (formData.first_name == "" || formData.first_name.trim().length == 0) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        first_name: "Must enter first name.",
      }));
      flag = true;
    }

    if (formData.last_name == "" || formData.last_name.trim().length == 0) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        last_name: "Must enter last name.",
      }));
      flag = true;
    }

    const validEmail =
      /^([a-z0-9]+[a-z0-9!#$%&'*+/=?^_`{|}~-]?(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/;

    if (formData.email == "" || formData.email.trim().length == 0) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        email: "Must enter email address.",
      }));
      flag = true;
    } else if (!validEmail.test(formData.email)) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        email: "Must enter valid email address.",
      }));
      flag = true;
    }

    if (formData.password == "" || formData.password.trim().length == 0) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        password: "Must enter current password.",
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

    return flag;
  };

  return (
    <>
      <div className="admin-wrapper flex flex-col h-full">
        <div className="header">
          <div className="breadcrumbs-wrapper">
            <div className="breadcrumb-item">
              <NavLink to="/dashboard/user-management" end>
                User Management
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
              <NavLink to="/dashboard/user-management/add-admin">
                Add Admin
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
            <div className="max-w-[360px]">
              <p>Add Admin</p>
              <span>
                Create an admin by providing their account information to manage
                HealthPH and its users.
              </span>
            </div>
            <div className="flex items-center">
              <button
                className="prod-btn-base prod-btn-secondary me-[16px]"
                onClick={() => {
                  navigate("/dashboard/admins", { replace: true });
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
          {error && <p className="prod-p4 text-[#D82727] mb-[8px]">{error}</p>}
          <FieldGroup
            label="User Type"
            labelFor="user-type"
            additionalClasses="w-full max-w-[360px] mb-[20px]"
            caption={formErrors.user_type != "" ? formErrors.user_type : ""}
            state={formErrors.user_type != "" ? "error" : ""}
          >
            <CustomSelect
              options={[
                {
                  label: "ADMIN",
                  value: "ADMIN",
                },
                {
                  label: "SUPERADMIN",
                  value: "SUPERADMIN",
                },
              ]}
              id="user-type"
              placeholder="Select user type"
              size="input-select-md"
              value={formData.user_type}
              handleChange={handleChangeUserType}
              additionalClasses="w-full mt-[8px]"
              state={formErrors.user_type != "" ? "error" : ""}
            />
          </FieldGroup>
          <FieldGroup
            label="Department Level"
            labelFor="department"
            additionalClasses="w-full max-w-[360px] mb-[20px]"
            caption={
              formErrors.department_level != ""
                ? formErrors.department_level
                : ""
            }
            state={formErrors.department_level != "" ? "error" : ""}
          >
            <CustomSelect
              options={[
                {
                  label: "National Level Office",
                  value: "national",
                },
                {
                  label: "Regional Level Office",
                  value: "regional",
                },
                {
                  label: "Provincial Level Office",
                  value: "provincial",
                },
                {
                  label: "City Level Office",
                  value: "city",
                },
                {
                  label: "Municipal Level Office",
                  value: "municipal",
                },
              ]}
              id="department"
              placeholder="Select Department Level"
              size="input-select-md"
              value={formData.department_level}
              handleChange={handleChangeDepartment}
              additionalClasses="w-full mt-[8px]"
              state={formErrors.department_level != "" ? "error" : ""}
            />
          </FieldGroup>
          <FieldGroup
            label="Organization"
            labelFor="organization"
            additionalClasses="w-full mb-[32px]"
            caption={
              formErrors.organization != "" ? formErrors.organization : ""
            }
            state={formErrors.organization != "" ? "error" : ""}
          >
            <Input
              size="input-md"
              id="organization"
              type="text"
              additionalClasses="w-full max-w-[360px] mt-[8px]"
              placeholder="Enter organization"
              value={formData.organization}
              onChange={(e) => {
                setFormData({ ...formData, organization: e.target.value });
                setFormErrors({ ...formErrors, organization: "" });
                setError("");
              }}
              state={formErrors.organization != "" ? "error" : ""}
              // required
            />
          </FieldGroup>
          <FieldGroup
            label="First Name"
            labelFor="first-name"
            additionalClasses="w-full max-w-[360px] mb-[20px]"
            caption={formErrors.first_name != "" ? formErrors.first_name : ""}
            state={formErrors.first_name != "" ? "error" : ""}
          >
            <Input
              size="input-md"
              id="first-name"
              type="text"
              additionalClasses="w-full mt-[8px]"
              placeholder="Enter first name"
              value={formData.first_name}
              onChange={(e) => {
                setFormData({ ...formData, first_name: e.target.value });
                setFormErrors({ ...formErrors, first_name: "" });
                setError("");
              }}
              state={formErrors.first_name != "" ? "error" : ""}
              // required
            />
          </FieldGroup>
          <FieldGroup
            label="Last Name"
            labelFor="last-name"
            additionalClasses="w-full max-w-[360px] mb-[20px]"
            caption={formErrors.last_name != "" ? formErrors.last_name : ""}
            state={formErrors.last_name != "" ? "error" : ""}
          >
            <Input
              size="input-md"
              id="last-name"
              type="text"
              additionalClasses="w-full mt-[8px]"
              placeholder="Enter last name"
              value={formData.last_name}
              onChange={(e) => {
                setFormData({ ...formData, last_name: e.target.value });
                setFormErrors({ ...formErrors, last_name: "" });
                setError("");
              }}
              state={formErrors.last_name != "" ? "error" : ""}
              // required
            />
          </FieldGroup>
          <FieldGroup
            label="Email"
            labelFor="email"
            additionalClasses="w-full mb-[10px]"
            caption={formErrors.email != "" ? formErrors.email : ""}
            state={formErrors.email != "" ? "error" : ""}
          >
            <Input
              size="input-md"
              id="email"
              type="email"
              additionalClasses="w-full max-w-[360px] mt-[8px]"
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
          <p className="w-full max-w-[360px] prod-p3 text-gray-700 mb-[20px]">
            This will be used to send the admin their account credentials.
          </p>
          <FieldGroup
            label="Password"
            labelFor="password"
            additionalClasses="w-full max-w-[360px] mb-[20px]"
            caption={formErrors.password != "" ? formErrors.password : ""}
            state={formErrors.password != "" ? "error" : ""}
          >
            <div className="flex items-center mt-[8px]">
              <InputPassword
                size="input-md"
                id="password"
                additionalClasses="w-full "
                placeholder="Enter password"
                value={formData.password}
                defaultShow={true}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setFormErrors({ ...formErrors, password: "" });
                  setError("");
                }}
                state={formErrors.password != "" ? "error" : ""}
                // required
              />
              <button
                type="button"
                className="prod-btn-base prod-btn-secondary ms-[16px]"
                onClick={(e) => {
                  if (!isLoading) {
                    generatePassword();
                  } else {
                    e.preventDefault();
                  }
                }}
                disabled={isLoading}
              >
                Generate
              </button>
            </div>
          </FieldGroup>
          <PasswordRequirements
            password={formData.password}
            pwdFlags={pwdFlags}
            handleChange={setPWDFlags}
          />
        </form>
      </div>
    </>
  );
};
export default AddAdmin;
