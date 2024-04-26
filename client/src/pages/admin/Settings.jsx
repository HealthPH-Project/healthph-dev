import { NavLink, useNavigate } from "react-router-dom";
import Icon from "../../components/Icon";
import { useState } from "react";
import FieldGroup from "../../components/FieldGroup";
import CustomSelect from "../../components/CustomSelect";
import Input from "../../components/Input";
import { useDispatch, useSelector } from "react-redux";
import {
  useDeleteUserMutation,
  useUpdatePersonalInfoMutation,
} from "../../features/api/userSlice";
import { updateUser, deauthenticateUser } from "../../features/auth/authSlice";
import Modal from "../../components/admin/Modal";

import Cookies from "js-cookie";
import Snackbar from "../../components/Snackbar";
import { toast } from "react-toastify";

const Settings = () => {
  const user = useSelector((state) => state.auth.user);

  const initialData = {
    id: user.id,
    department_level: user.department_level,
    organization: user.organization,
    first_name: user.first_name,
    last_name: user.last_name,
  };

  const [editable, setEditable] = useState(false);

  const [formData, setFormData] = useState(initialData);

  const [formErrors, setFormErrors] = useState({
    department_level: "",
    organization: "",
    first_name: "",
    last_name: "",
  });

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [updatePersonalInfo] = useUpdatePersonalInfoMutation();

  const [modalActive, setModalActive] = useState(false);

  const [deleteUser] = useDeleteUserMutation();

  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleChangeDepartment = (value) => {
    setFormData({ ...formData, department_level: value });
    setFormErrors((formErrors) => ({
      ...formErrors,
      department_level: "",
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkError()) {
      setIsLoading(true);
      const response = await updatePersonalInfo(formData);

      if (!response) {
        toast(
          <Snackbar
            iconName="Error"
            size="snackbar-sm"
            color="destructive"
            message="Updating personal information failed"
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

      setEditable(false);

      toast(
        <Snackbar
          iconName="CheckCircle"
          size="snackbar-sm"
          color="success"
          message="Profile updated successfully"
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

    return flag;
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);

    const response = await deleteUser(user.id);

    if (!response) {
      console.log("Error deleting account...");
      setDeleteLoading(false);
      return;
    }

    if ("error" in response) {
      const { detail } = response["error"]["data"];

      setDeleteLoading(false);

      console.log(detail);
      return;
    }

    setDeleteLoading(false);

    navigate("/", { replace: true });

    dispatch(deauthenticateUser());

    Cookies.remove("token");

    localStorage.removeItem("auth");

    toast(
      <Snackbar
        iconName="CheckCircle"
        size="snackbar-sm"
        color="success"
        message="Account deleted successfully"
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
  };
  return (
    <>
      <div className="admin-wrapper flex flex-col h-full">
        <div className="header">
          <div className="breadcrumbs-wrapper">
            <div className="breadcrumb-item">
              <NavLink to="/dashboard/settings">Settings</NavLink>
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
              <p>Personal Information</p>
              <span>This will be displayed on your navigation. </span>
            </div>
            {!editable ? (
              <button
                className="prod-btn-base prod-btn-primary"
                onClick={() => setEditable(true)}
              >
                Edit Personal Information
              </button>
            ) : (
              <div className="flex items-center">
                <button
                  type="button"
                  className="prod-btn-base prod-btn-secondary me-[16px]"
                  onClick={() => {
                    setEditable(false);
                    setFormData(initialData);
                    const emptyData = { ...formErrors };
                    Object.keys(emptyData).forEach(
                      (key) => (emptyData[key] = "")
                    );
                    setFormErrors(emptyData);
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
            )}
          </div>
          {error && <p className="prod-p4  text-[#D82727] mb-[8px]">{error}</p>}
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
                if (editable) {
                  setFormData({ ...formData, first_name: e.target.value });
                  setFormErrors({ ...formErrors, first_name: "" });
                  setError("");
                } else {
                  e.preventDefault();
                }
              }}
              state={formErrors.first_name != "" ? "error" : ""}
              // required
              readOnly={!editable}
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
                if (editable) {
                  setFormData({ ...formData, last_name: e.target.value });
                  setFormErrors({ ...formErrors, last_name: "" });
                  setError("");
                } else {
                  e.preventDefault();
                }
              }}
              state={formErrors.last_name != "" ? "error" : ""}
              // required
              readOnly={!editable}
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
              editable={editable}
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
                if (editable) {
                  setFormData({ ...formData, organization: e.target.value });
                  setFormErrors({ ...formErrors, organization: "" });
                  setError("");
                } else {
                  e.preventDefault();
                }
              }}
              state={formErrors.organization != "" ? "error" : ""}
              // required
              readOnly={!editable}
            />
          </FieldGroup>
        </form>

        <div className="settings-header">
          <div>
            <p>Email</p>
            <span>This will be used as your identification.</span>
          </div>
          <NavLink
            to="/dashboard/settings/edit-email"
            className="prod-btn-base prod-btn-primary"
          >
            Edit Email
          </NavLink>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-[32px]">
          <p className="prod-p1 text-gray-700 font-medium me-[16px] mb-[16px] sm:mb-0">
            {user.email}
          </p>
          <div className="flex items-center">
            {user.is_verified ? (
              <div className="badge-md badge-green me-[4px]">Verified</div>
            ) : (
              <div className="badge-md badge-red me-[4px] text-center">
                Not Verified
              </div>
            )}
            <div className="custom-tooltip">
              <Icon
                iconName="Information"
                height="16px"
                width="16px"
                fill="#8693A0"
              />
              <div className="tooltip">Test tooltip</div>
            </div>
          </div>
        </div>
        <div className="settings-header">
          <div>
            <p>Password</p>
            <span>This will be used to sign in to your account.</span>
          </div>
          <NavLink
            to="/dashboard/settings/edit-password "
            className="prod-btn-base prod-btn-primary"
          >
            Edit Password
          </NavLink>
        </div>

        <div className="settings-header">
          <div>
            <p>Delete Account</p>
            <span>Delete your account when not in use.</span>
          </div>
          <button
            className="prod-btn-base prod-btn-destructive"
            onClick={() => setModalActive(true)}
          >
            Delete Account
          </button>
        </div>
      </div>

      {modalActive && (
        <Modal
          onConfirm={handleDeleteAccount}
          onConfirmLabel="Delete"
          onCancel={() => {
            if (!deleteLoading) setModalActive(false);
          }}
          onLoading={deleteLoading}
          onLoadingLabel="Deleting..."
          heading="Are you sure you want to delete your account?"
          content="You can never use your account again to use HealthPH anymore."
          color="destructive"
        />
      )}
    </>
  );
};
export default Settings;
