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
  useDeleteAdminMutation,
  useDeleteUsersMutation,
  useDisableUserMutation,
} from "../../features/api/userSlice";
import { useCreateActivityLogMutation } from "../../features/api/activityLogsSlice";
import { format } from "date-fns";

const AdminsTable = ({
  admins,
  setCurrentData,
  tableTabs,
  searchQuery,
  setSearchQuery,
}) => {
  const user = useSelector((state) => state.auth.user);

  const [tableData, setTableData] = useState([]);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (admins) {
      setTableData(admins);
      setCurrentData(admins);
    }
  }, [admins]);

  useEffect(() => {
    setRows(tableData.slice(0, 10));
  }, [tableData]);

  useEffect(() => {
    if (admins) {
      let searchQuerySplit = searchQuery.split(" ");
      searchQuerySplit = searchQuerySplit.filter((s) => s.length > 0);

      const filteredRows = admins.filter((admin) => {
        return searchQuerySplit.some((s) => {
          const reg = new RegExp("^.*" + s + ".*$", "i");
          if (
            reg.test(admin["last_name"]) ||
            reg.test(admin["first_name"]) ||
            reg.test(admin["email"])
          ) {
            return true;
          }
        });
      });

      setTableData(searchQuery.length > 0 ? filteredRows : admins);
      setCurrentData(searchQuery.length > 0 ? filteredRows : admins);
    }
  }, [searchQuery]);

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

  const [deleteAdmin] = useDeleteAdminMutation();

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

  const handleDeleteAdmin = async () => {
    setIsModalLoading(true);

    const response = await deleteAdmin(modalData.id);

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

  return (
    <>
      <Datatable
        datatableTabs={tableTabs}
        datatableColumns={[
          { label: "Full Name" },
          { label: "Email", tooltip: "Sample tooltip" },
          { label: "Date Created" },
          { label: "User Type", tooltip: "Sample tooltip" },
          { label: "Actions" },
        ]}
        datatableData={tableData}
        setDatatableData={setRows}
        rowsPerPage={10}
        withActions={true}
        actionsWidth={user.user_type == "SUPERADMIN" ? "170px" : "100px"}
      >
        {admins.length > 0 ? (
          rows.length > 0 ? (
            rows.map(
              (
                {
                  id,
                  first_name,
                  last_name,
                  email,
                  created_at,
                  user_type,
                  is_disabled,
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
                        highlightClassName="bg-[#FFE81A] text-[#000] font-medium rounded-[2px] p-[2px]"
                        searchWords={searchWords}
                        autoEscape={true}
                        textToHighlight={`${first_name} ${last_name}`}
                      />
                    </div>
                    <div className="row-item">
                      <Highlighter
                        highlightClassName="bg-[#FFE81A] text-[#000] font-medium  rounded-[2px] p-[2px]"
                        searchWords={searchWords}
                        autoEscape={true}
                        textToHighlight={email}
                      />
                    </div>
                    <div className="row-item">
                      {format(new Date(created_at), "MMM-dd-yyyy HH:mm a")}
                    </div>
                    <div className="row-item">{user_type}</div>
                    <div className="row-item">
                      {user && user.user_type == "USER" ? null : (
                        <div className="flex items-center">
                          {user.id != id && (
                            <button
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
                          )}
                          {user.id != id && user.user_type !== "ADMIN" && (
                            <button
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
                          )}
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
            iconName="UserTwo"
            heading="No Administrators Found"
            content="There are currently no administrators listed. Add new administrators to manage the platform effectively."
          >
            {["ADMIN", "SUPERADMIN"].includes(user.user_type) && (
              <NavLink
                to="/dashboard/user-management/add-user"
                className="prod-btn-base prod-btn-primary flex justify-center items-center ms-[16px]"
              >
                <span>Add Admin</span>
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
            handleDeleteAdmin();
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
    </>
  );
};

export default AdminsTable;
