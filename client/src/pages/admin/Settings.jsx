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

import Regions from "../../assets/data/regions.json";
import MultiSelect from "../../components/MultiSelect";

const Settings = () => {
  const user = useSelector((state) => state.auth.user);

  const initialData = {
    id: user.id,
    region: user.region,
    organization: user.organization,
    first_name: user.first_name,
    last_name: user.last_name,
    accessible_regions: user.accessible_regions,
  };

  const [editable, setEditable] = useState(false);

  const [formData, setFormData] = useState(initialData);

  const [formErrors, setFormErrors] = useState({
    region: "",
    organization: "",
    first_name: "",
    last_name: "",
    accessible_regions: "",
  });

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [updatePersonalInfo] = useUpdatePersonalInfoMutation();

  const [modalActive, setModalActive] = useState(false);

  const [deleteUser] = useDeleteUserMutation();

  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleChangeRegion = (value) => {
    setFormData({ ...formData, region: value });
    setFormErrors((formErrors) => ({
      ...formErrors,
      region: "",
    }));
    setError("");
  };

  const getAccessibleRegionsDisplay = () => {
    const accessible_regions = user.accessible_regions;

    let display = "";

    const regionNames = Regions.regions.reduce((acc, current) => {
      acc[current.value] = current.label;
      return acc;
    }, {});

    if (accessible_regions.length > 2) {
      display = `${regionNames[accessible_regions[0]]}, ${
        regionNames[accessible_regions[1]]
      } + ${accessible_regions.length - 2}`;
    } else {
      for (let i = 0; i < accessible_regions.length; i++) {
        display += regionNames[accessible_regions[i]];
        if (accessible_regions.length != i + 1) {
          display += ", ";
        }
      }
    }

    return accessible_regions.length == Regions.regions.length
      ? "All Regions"
      : display;
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
      [key]: "",
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

    if (formData.region == "") {
      setFormErrors((formErrors) => ({
        ...formErrors,
        region: "Must choose region.",
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
                type="button"
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
          {error && <p className="prod-p4 text-[#D82727] mb-[8px]">{error}</p>}

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

          {/* REGION */}
          {user.user_type == "USER" && (
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
                editable={editable}
              />
            </FieldGroup>
          )}

          <FieldGroup
            label="Accessible Regions"
            labelFor="accessible-regions"
            additionalClasses="w-full mb-[20px]"
            caption={
              formErrors.accessible_regions != ""
                ? formErrors.accessible_regions
                : ""
            }
            state={formErrors.accessible_regions != "" ? "error" : ""}
          >
            <MultiSelect
              options={Regions.regions.filter((r) =>
                user.accessible_regions.includes(r.value)
              )}
              defaultValue={user.accessible_regions}
              placeHolder="Select Region/s"
              onChange={(e) =>
                handleChangeAccessibleRegions("accessible_regions", e)
              }
              selectAllLabel={getAccessibleRegionsDisplay()}
              selectAll={true}
              showSelectAll={user.user_type == "USER" ? false : true}
              additionalClassname="w-full  max-w-[360px] mt-[8px]"
              // selectable={["ADMIN", "SUPERADMIN"].includes(user.user_type)}
              selectable={false}
            />
          </FieldGroup>

          {/* ORGANIZATION */}
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
                if (
                  editable &&
                  !["ADMIN", "SUPERADMIN"].includes(user.user_type)
                ) {
                  setFormData({ ...formData, organization: e.target.value });
                  setFormErrors({ ...formErrors, organization: "" });
                  setError("");
                } else {
                  e.preventDefault();
                }
              }}
              state={formErrors.organization != "" ? "error" : ""}
              // required
              readOnly={
                ["ADMIN", "SUPERADMIN"].includes(user.user_type)
                  ? true
                  : !editable
              }
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
            {user.is_disabled && (
              <>
                <div className="badge-md badge-red me-[4px] text-center">
                  Disabled
                </div>
                <div className="custom-tooltip">
                  <Icon
                    iconName="Information"
                    height="16px"
                    width="16px"
                    fill="#8693A0"
                  />
                  <div className="tooltip">
                    Account has been disabled by the administrators
                  </div>
                </div>
              </>
            )}
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

        <div className="settings-header">
          <div>
            <p>Report an Issue</p>
            <span>Reach out to HealthPH for help.</span>
          </div>
          <a
            className="prod-btn-base prod-btn-secondary"
            href={`mailto:${import.meta.env.VITE_HEALTHPH_EMAIL}`}
          >
            Report Issue
          </a>
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
