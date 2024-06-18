import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import Icon from "../../components/Icon";
import FieldGroup from "../../components/FieldGroup";
import Input from "../../components/Input";
import CustomSelect from "../../components/CustomSelect";
import InputPassword from "../../components/InputPassword";
import PasswordRequirements from "../../components/auth/PasswordRequirements";
import Snackbar from "../../components/Snackbar";
import Regions from "../../assets/data/regions.json";

import { useCreateUserMutation } from "../../features/api/userSlice";
import { useCreateActivityLogMutation } from "../../features/api/activityLogsSlice";
import MultiSelect from "../../components/MultiSelect";

const AddUser = () => {
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    user_type: "",
    region: "",
    accessible_regions: "",
    organization: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    user_type: "",
    region: "",
    accessible_regions: "",
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

  const [createUser] = useCreateUserMutation();

  const [log_activity] = useCreateActivityLogMutation();

  const navigate = useNavigate();

  const handleChangeUserType = (value) => {
    if (["ADMIN", "SUPERADMIN"].includes(value)) {
      setFormData({
        ...formData,
        user_type: value,
        region: "ALL",
        organization: import.meta.env.VITE_ADMIN_ORG,
        accessible_regions: Regions.regions
          .map(({ value }, i) => {
            return value;
          })
          .join(","),
      });
      setFormErrors((formErrors) => ({
        ...formErrors,
        organization: "",
        region: "",
      }));
    } else {
      if (formData.organization == import.meta.env.VITE_ADMIN_ORG) {
        setFormData({
          ...formData,
          user_type: value,
          region: "",
          organization: "",
          accessible_regions: "",
        });
      } else {
        setFormData({
          ...formData,
          region: "",
          user_type: value,
          accessible_regions: "",
        });
      }
    }
    setFormErrors((formErrors) => ({
      ...formErrors,
      user_type: "",
    }));
    setError("");
  };

  const handleChangeRegion = (value) => {
    setFormData({ ...formData, region: value });
    setFormErrors((formErrors) => ({
      ...formErrors,
      region: "",
    }));
    setError("");
  };

  const handleChangeAccessibleRegions = (key, value) => {
    const newValue = value
      .map(({ value }, i) => {
        return value;
      })
      .join(",");
    setFormData((filters) => ({
      ...filters,
      [key]: newValue,
    }));

    setFormErrors((formErrors) => ({
      ...formErrors,
      accessible_regions: "",
    }));
    setError("");
  };

  useEffect(() => {
    if (["ADMIN", "SUPERADMIN"].includes(formData.user_type)) {
      // handleChangeAccessibleRegions(
      //   "accessible_regions",
      //   Regions.regions.filter((r) => r.value != "N/A")
      // );
    }
  }, [formData.user_type]);

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

      const response = await createUser(formData);

      if (!response) {
        toast(
          <Snackbar
            iconName="Error"
            size="snackbar-sm"
            color="destructive"
            message="Failed to create user"
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
          message="User added successfully"
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

    if (formData.region == "") {
      setFormErrors((formErrors) => ({
        ...formErrors,
        region: "Must choose region.",
      }));
      flag = true;
    }

    if (formData.accessible_regions == "") {
      setFormErrors((formErrors) => ({
        ...formErrors,
        accessible_regions: "Must choose at least one accessible region.",
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

  useEffect(() => {
    if (user) {
      if (user.user_type == "ADMIN") {
        handleChangeUserType("USER");
      }
    }
  }, [user]);

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
              <NavLink to="/dashboard/user-management/add-user">
                Add User
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
              <p>Add User</p>
              <span>
                Create an admin or user by providing their account information
                to manage HealthPH.
              </span>
            </div>
            <div className="flex items-center">
              <button
                type="button"
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

          {/* USER TYPE */}
          <FieldGroup
            label="User Type"
            labelFor="user-type"
            additionalClasses="w-full max-w-[360px] mb-[20px]"
            caption={formErrors.user_type != "" ? formErrors.user_type : ""}
            state={formErrors.user_type != "" ? "error" : ""}
          >
            <CustomSelect
              options={
                user.user_type == "ADMIN"
                  ? [{ label: "USER", value: "USER" }]
                  : [
                      { label: "USER", value: "USER" },
                      { label: "ADMIN", value: "ADMIN" },
                      { label: "SUPERADMIN", value: "SUPERADMIN" },
                    ]
              }
              id="user-type"
              placeholder="Select user type"
              size="input-select-md"
              value={formData.user_type}
              handleChange={handleChangeUserType}
              additionalClasses="w-full mt-[8px]"
              state={formErrors.user_type != "" ? "error" : ""}
            />
          </FieldGroup>

          {/* REGION */}
          {["USER"].includes(formData.user_type) && (
            <FieldGroup
              label="Regional Office"
              labelFor="region"
              additionalClasses="w-full max-w-[360px] mb-[20px]"
              caption={formErrors.region != "" ? formErrors.region : ""}
              state={formErrors.region != "" ? "error" : ""}
            >
              <CustomSelect
                options={[
                  {
                    label: "National Capital Region",
                    value: "NCR",
                  },
                  {
                    label: "Region I",
                    value: "I",
                  },
                  {
                    label: "Region II",
                    value: "II",
                  },
                  {
                    label: "Region III",
                    value: "III",
                  },
                  {
                    label: "Cordillera Administrative Region (CAR)",
                    value: "CAR",
                  },
                  {
                    label: "Region IV-A (CALABARZON)",
                    value: "IVA",
                  },
                  {
                    label: "Region IV-B (MIMAROPA)",
                    value: "IVB",
                  },
                  {
                    label: "Region V",
                    value: "V",
                  },
                  {
                    label: "Region VI",
                    value: "VI",
                  },
                  {
                    label: "Region VII",
                    value: "VII",
                  },
                  {
                    label: "Region VIII",
                    value: "VIII",
                  },
                  {
                    label: "Region IX",
                    value: "IX",
                  },
                  {
                    label: "Region X",
                    value: "X",
                  },
                  {
                    label: "Region XI",
                    value: "XI",
                  },
                  {
                    label: "Region XII",
                    value: "XII",
                  },
                  {
                    label: "Region XIII",
                    value: "XIII",
                  },
                  {
                    label:
                      "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)",
                    value: "BARMM",
                  },
                ]}
                id="region"
                placeholder="Select Region"
                size="input-select-md"
                value={formData.region}
                handleChange={handleChangeRegion}
                additionalClasses="w-full mt-[8px]"
                state={formErrors.region != "" ? "error" : ""}
                menuMaxHeight="max-h-[250px]"
              />
            </FieldGroup>
          )}

          {formData.user_type != "" && (
            <FieldGroup
              label="Accessible Regions"
              labelFor="accessible-regions"
              additionalClasses="w-full max-w-[360px] mb-[20px]"
              caption={
                formErrors.accessible_regions != ""
                  ? formErrors.accessible_regions
                  : ""
              }
              state={formErrors.accessible_regions != "" ? "error" : ""}
            >
              <MultiSelect
                options={Regions.regions}
                placeHolder="Select Region/s"
                onChange={(e) =>
                  handleChangeAccessibleRegions("accessible_regions", e)
                }
                selectAllLabel="All Regions"
                selectAll={
                  ["", "USER"].includes(formData.user_type) ? false : true
                }
                // selectAll={true}
                additionalClassname="w-full mt-[8px]"
                editable={
                  ["", "USER"].includes(formData.user_type) ? true : false
                }
                state={formErrors.accessible_regions != "" ? "error" : ""}
              />
            </FieldGroup>
          )}

          {/* ORGANIZATION */}
          <FieldGroup
            label="Organization"
            labelFor="organization"
            additionalClasses="w-full mb-[20px]"
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

          {/* FIRST NAME */}
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

          {/* LAST NAME */}
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

          {/* EMAIL */}
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

          {/* PASSWORD */}
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

export default AddUser;
