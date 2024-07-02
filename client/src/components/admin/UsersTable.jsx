import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

import Highlighter from "react-highlight-words";

import Datatable from "./Datatable";
import EmptyState from "./EmptyState";
import Icon from "../Icon";
import Modal from "./Modal";
import Snackbar from "../Snackbar";

import {
  useDeleteUsersMutation,
  useDisableUserMutation,
  useUpdateUserMutation,
} from "../../features/api/userSlice";
import { useCreateActivityLogMutation } from "../../features/api/activityLogsSlice";
import ModalWithBody from "./ModalWithBody";
import FieldGroup from "../FieldGroup";

import Regions from "../../assets/data/regions.json";
import MultiSelect from "../MultiSelect";

const UsersTable = ({
  users,
  setCurrentData,
  tableTabs,
  searchQuery,
  setSearchQuery,
}) => {
  const user = useSelector((state) => state.auth.user);

  const [tableData, setTableData] = useState([]);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (users) {
      setTableData(users);
      setCurrentData(users);
    }
  }, [users]);
  useEffect(() => {
    setRows(tableData.slice(0, 10));
  }, [tableData]);

  useEffect(() => {
    if (users) {
      let searchQuerySplit = searchQuery.split(" ");
      searchQuerySplit = searchQuerySplit.filter((s) => s.length > 0);

      const filteredRows = users.filter((user) => {
        return searchQuerySplit.some((s) => {
          const reg = new RegExp("^.*" + s + ".*$", "i");
          if (
            reg.test(user["last_name"]) ||
            reg.test(user["first_name"]) ||
            reg.test(user["email"]) ||
            reg.test(user["organization"])
          ) {
            return true;
          }
        });
      });

      setTableData(searchQuery.length > 0 ? filteredRows : users);
      setCurrentData(searchQuery.length > 0 ? filteredRows : users);
    }
  }, [searchQuery]);

  const displayRegion = (region) => {
    const regions = {
      NCR: "National Capital Region",
      I: "Region I",
      II: "Region II",
      III: "Region III",
      CAR: "Cordillera Administrative Region (CAR)",
      IVA: "Region IV-A (CALABARZON)",
      IVB: "Region IV-B (MIMAROPA)",
      V: "Region V",
      VI: "Region VI",
      VII: "Region VII",
      VIII: "Region VIII",
      IX: "Region IX",
      X: "Region X",
      XI: "Region XI",
      XII: "Region XII",
      XIII: "Region XIII",
      BARMM: "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)",
    };

    return regions[region];
  };

  const [modalData, setModalData] = useState({
    id: "",
    name: "",
    user_type: "",
  });

  const [deleteModalActive, setDeleteModalActive] = useState(false);

  const [disableModalActive, setDisableModalActive] = useState(false);

  const [enableModalActive, setEnableModalActive] = useState(false);

  const [isModalLoading, setIsModalLoading] = useState(false);

  const [updateUserStatus] = useDisableUserMutation();

  const [deleteUser] = useDeleteUsersMutation();

  const [log_activity] = useCreateActivityLogMutation();

  const handleChangeStatus = async (status) => {
    setIsModalLoading(true);

    const response = await updateUserStatus({ id: modalData.id, status });

    if (!response) {
      toast(
        <Snackbar
          iconName="Error"
          size="snackbar-sm"
          color="destructive"
          message={status ? "Failed to disable user" : "Failed to enable user"}
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
      setIsModalLoading(false);
      return;
    }

    if ("error" in response) {
      const { detail } = response["error"]["data"];

      toast(
        <Snackbar
          iconName="Error"
          size="snackbar-sm"
          color="destructive"
          message={detail}
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
      return;
    }

    toast(
      <Snackbar
        iconName="CheckCircle"
        size="snackbar-sm"
        color="success"
        message={`User ${status ? "disabled" : "enabled"} successfully`}
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
      entry: `${status ? "Disabled" : "Enabled"} ${modalData.user_type} : ${
        modalData.name
      }`,
      module: "User Management",
    });

    setIsModalLoading(false);
    setModalData({ id: "", name: "", user_type: "" });
    if (status) {
      setDisableModalActive(false);
    } else {
      setEnableModalActive(false);
    }
  };

  const handleDeleteUser = async () => {
    setIsModalLoading(true);

    const response = await deleteUser(modalData.id);

    if (!response) {
      toast(
        <Snackbar
          iconName="Error"
          size="snackbar-sm"
          color="destructive"
          message={`Failed to delete user`}
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
      setIsModalLoading(false);
      return;
    }

    if ("error" in response) {
      const { detail } = response["error"]["data"];

      toast(
        <Snackbar
          iconName="Error"
          size="snackbar-sm"
          color="destructive"
          message={detail}
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

      setIsModalLoading(false);
      return;
    }

    toast(
      <Snackbar
        iconName="CheckCircle"
        size="snackbar-sm"
        color="success"
        message={`User deleted successfully`}
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
      entry: `Deleted ${modalData.user_type} : ${modalData.name}`,
      module: "User Management",
    });

    setIsModalLoading(false);
    setModalData({ id: "", name: "", user_type: "" });
    setDeleteModalActive(false);
  };

  const [updateModalActive, setUpdateModalActive] = useState(false);

  const [updateModalData, setUpdateModalData] = useState({
    id: "",
    name: "",
    accessible_regions: [],
  });

  const [updateModalErrors, setUpdateModalErrors] = useState({
    accessible_regions: "",
  });

  const [updateUser] = useUpdateUserMutation();

  const handleUpdateUser = async () => {
    const payload = {
      id: updateModalData.id,
      accessible_regions: updateModalData.accessible_regions.join(","),
    };

    if (payload.accessible_regions == "" || updateModalData.length == 0) {
      setUpdateModalErrors((errors) => {
        return {
          ...errors,
          accessible_regions: "Must choose at least one accessible region.",
        };
      });

      return;
    }

    setIsModalLoading(true);

    const response = await updateUser(payload);

    if (!response) {
      toast(
        <Snackbar
          iconName="Error"
          size="snackbar-sm"
          color="destructive"
          message={"Failed to update User"}
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
      setIsModalLoading(false);
      return;
    }

    if ("error" in response) {
      const { detail } = response["error"]["data"];

      detail.map(({ field, error }, i) => {
        if (field in updateModalData) {
          setUpdateModalErrors((formErrors) => ({
            ...formErrors,
            [field]: error,
          }));
        } else if (field == "error") {
          setError(error);
        } else {
          toast(
            <Snackbar
              iconName="Error"
              size="snackbar-sm"
              color="destructive"
              message={detail}
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

      setIsModalLoading(false);
      return;
    }

    toast(
      <Snackbar
        iconName="CheckCircle"
        size="snackbar-sm"
        color="success"
        message={`User updated successfully`}
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
      entry: `Updated USER : ${updateModalData.name}`,
      module: "User Management",
    });

    setIsModalLoading(false);
    setUpdateModalData({ id: "", name: "", accessible_regions: [] });
    setUpdateModalActive(false);
  };

  return (
    <>
      <Datatable
        datatableTabs={tableTabs}
        datatableColumns={[
          { label: "Full Name" },
          { label: "Email", tooltip: "Sample tooltip" },
          { label: "Regional Office " },
          { label: "Organization ", tooltip: "Sample tooltip" },
          { label: "Actions" },
        ]}
        datatableData={tableData}
        setDatatableData={setRows}
        rowsPerPage={10}
        withActions={true}
        // actionsWidth={user.user_type == "SUPERADMIN" ? "220px" : "100px"}
        actionsWidth={"220px"}
      >
        {users.length > 0 ? (
          rows.length > 0 ? (
            rows.map(
              (
                {
                  id,
                  first_name,
                  last_name,
                  email,
                  region,
                  accessible_regions,
                  organization,
                  is_disabled,
                  user_type,
                },
                i
              ) => {
                const searchWords = searchQuery
                  .split(" ")
                  .filter((s) => s.length > 0);
                return (
                  <div className="content-row" key={i}>
                    <div className="row-item">
                      <Highlighter
                        highlightClassName="bg-warning-500 font-medium"
                        searchWords={searchWords}
                        autoEscape={true}
                        textToHighlight={`${first_name} ${last_name}`}
                      />
                    </div>
                    <div className="row-item">
                      <Highlighter
                        highlightClassName="bg-warning-500"
                        searchWords={searchWords}
                        autoEscape={true}
                        textToHighlight={email}
                      />
                    </div>
                    <div className="row-item">{displayRegion(region)}</div>
                    <div className="row-item">
                      <Highlighter
                        highlightClassName="bg-warning-500 font-medium"
                        searchWords={searchWords}
                        autoEscape={true}
                        textToHighlight={organization}
                      />
                    </div>
                    <div className="row-item">
                      {user && user.user_type == "USER" ? null : (
                        <div className="flex items-center">
                          <button
                            type="button"
                            className="prod-push-btn-sm prod-btn-primary me-[8px] min-w-[63px]"
                            onClick={() => {
                              setUpdateModalData({
                                id: id,
                                name: `${first_name} ${last_name}`,
                                accessible_regions: accessible_regions,
                              });
                              setUpdateModalActive(true);
                            }}
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            className={`prod-push-btn-sm prod-btn-${
                              is_disabled ? "primary" : "secondary"
                            } me-[8px]  min-w-[63px]`}
                            onClick={() => {
                              setModalData({
                                id: id,
                                name: `${first_name} ${last_name}`,
                                user_type: user_type,
                              });

                              if (is_disabled) {
                                setEnableModalActive(true);
                              } else {
                                setDisableModalActive(true);
                              }
                            }}
                          >
                            {is_disabled ? "Enable" : "Disable"}
                          </button>
                          <button
                            type="button"
                            className="prod-push-btn-sm prod-btn-destructive"
                            onClick={() => {
                              setModalData({
                                id: id,
                                name: `${first_name} ${last_name}`,
                                user_type: user_type,
                              });
                              setDeleteModalActive(true);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            )
          ) : (
            searchQuery != "" && (
              <EmptyState
                iconName="Search"
                heading="No Results Found"
                content="We couldn't find any matches for your search. Please try adjusting your search terms or criteria."
              >
                <button
                  className="prod-btn-base prod-btn-secondary flex justify-center items-center"
                  onClick={() => setSearchQuery("")}
                >
                  <span>Clear Search</span>
                </button>
              </EmptyState>
            )
          )
        ) : (
          <EmptyState
            iconName="UserThree"
            heading="No Users Found"
            content="No users are currently created. Add users to join and participate."
          >
            {["ADMIN", "SUPERADMIN"].includes(user.user_type) && (
              <NavLink
                to="/dashboard/user-management/add-user"
                className="prod-btn-base prod-btn-primary flex justify-center items-center ms-[16px]"
              >
                <span>Add User</span>
                <Icon
                  iconName="Plus"
                  height="20px"
                  width="20px"
                  fill="#FFF"
                  className="ms-[8px]"
                />
              </NavLink>
            )}
          </EmptyState>
        )}
      </Datatable>

      {/* MODALS */}

      {deleteModalActive && (
        <Modal
          onLoading={isModalLoading}
          onLoadingLabel="Deleting..."
          onConfirm={() => {
            handleDeleteUser();
          }}
          onConfirmLabel="Delete"
          onCancel={() => {
            setModalData({ id: "", name: "", user_type: "" });
            setDeleteModalActive(false);
          }}
          heading={`Are you sure you want to delete ${modalData.name}'s account?`}
          content="This user can never use their account to HealthPH anymore."
          color="destructive"
        />
      )}

      {disableModalActive && (
        <Modal
          onLoading={isModalLoading}
          onLoadingLabel={"Disabling"}
          onConfirm={() => {
            handleChangeStatus(true);
          }}
          onConfirmLabel="Disable"
          onCancel={() => {
            setModalData({ id: "", name: "", user_type: "" });
            setDisableModalActive(false);
          }}
          heading={`Are you sure you want to disable ${modalData.name}'s account?`}
          content="This user will be unable to sign in to HealthPH and lose access to its modules."
          color="destructive"
        />
      )}

      {enableModalActive && (
        <Modal
          onLoading={isModalLoading}
          onLoadingLabel={"Enabling"}
          onConfirm={() => {
            handleChangeStatus(false);
          }}
          onConfirmLabel="Enable"
          onCancel={() => {
            setModalData({ id: "", name: "", user_type: "" });
            setEnableModalActive(false);
          }}
          heading={`Are you sure you want to enable ${modalData.name}'s account?`}
          content="This user will receive full access to HealthPH such as the Analytics, Trends Map, and other modules."
          color="primary"
        />
      )}

      {updateModalActive && (
        <ModalWithBody
          onLoading={isModalLoading}
          onLoadingLabel={"Updating"}
          onConfirm={() => {
            handleUpdateUser();
          }}
          onConfirmLabel="Update"
          onCancel={() => {
            setUpdateModalData({ id: "", name: "", accessible_regions: [] });
            setUpdateModalActive(false);
          }}
          heading={`Update ${updateModalData.name}'s account`}
          content="This user will receive full access to HealthPH such as the Analytics, Trends Map, and other modules."
          color="primary"
        >
          <div className="p-[20px]">
            <FieldGroup
              label="Accessible Regions"
              labelFor="accessible-regions"
              additionalClasses="w-full mb-[20px]"
              caption={
                updateModalErrors.accessible_regions != ""
                  ? updateModalErrors.accessible_regions
                  : ""
              }
              state={updateModalErrors.accessible_regions != "" ? "error" : ""}
            >
              <MultiSelect
                options={Regions.regions}
                defaultValue={updateModalData.accessible_regions}
                placeHolder="Select Region/s"
                onChange={(e) => {
                  setUpdateModalErrors((errors) => {
                    return { ...errors, accessible_regions: "" };
                  });
                  setUpdateModalData((data) => {
                    return {
                      ...data,
                      accessible_regions: e.map((v, i) => v.value),
                    };
                  });
                }}
                selectAllLabel="All Regions"
                selectAll={false}
                additionalClassname="w-full mt-[8px]"
                editable={true}
                state={
                  updateModalErrors.accessible_regions != "" ? "error" : ""
                }
              />
            </FieldGroup>
          </div>
        </ModalWithBody>
      )}
    </>
  );
};

export default UsersTable;
