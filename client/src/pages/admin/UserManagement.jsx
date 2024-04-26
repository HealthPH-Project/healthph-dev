import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useDeleteAdminMutation,
  useDeleteUsersMutation,
  useFetchAdminsQuery,
  useFetchUsersQuery,
  useVerifyUserMutation,
} from "../../features/api/userSlice";
import { useCreateActivityLogMutation } from "../../features/api/activityLogsSlice";
import SkeletonTable from "../../components/SkeletonTable";
import Icon from "../../components/Icon";
import Highlighter from "react-highlight-words";
import { NavLink } from "react-router-dom";
import Input from "../../components/Input";
import Datatable from "../../components/admin/Datatable";
import { format } from "date-fns";
import Modal from "../../components/admin/Modal";
import { current } from "@reduxjs/toolkit";
import EmptyState from "../../components/admin/EmptyState";
import { toast } from "react-toastify";
import Snackbar from "../../components/Snackbar";

const UserManagement = () => {
  const user = useSelector((state) => state.auth.user);

  const [tableTab, setTableTab] = useState("Admins");

  const [search, setSearch] = useState("");

  const [searchAdminRows, setSearchAdminRows] = useState("");

  const [searchUserRows, setSearchUserRows] = useState("");
  let {
    data: admins,
    isLoading: isAdminsLoading,
    isError: isAdminsError,
  } = useFetchAdminsQuery();

  let {
    data: users,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useFetchUsersQuery();

  const [rows, setRows] = useState([]);

  const [userRows, setUserRows] = useState([]);

  const [deleteModalActive, setDeleteModalActive] = useState(false);

  const [verificationLoading, setVerificationLoading] = useState(false);

  const [verifyModalActive, setVerifyModalActive] = useState(false);

  const [unverifyModalActive, setUnverifyModalActive] = useState(false);

  const [modalData, setModalData] = useState({
    id: "",
    name: "",
    user_type: "",
  });

  const [isModalLoading, setIsModalLoading] = useState(false);

  const [deleteAdmin] = useDeleteAdminMutation();

  const [deleteUsers] = useDeleteUsersMutation();

  const [verifyUser] = useVerifyUserMutation();

  const [log_activiy] = useCreateActivityLogMutation();

  useEffect(() => {
    if (admins) {
      setRows(admins);
    }
  }, [admins, isAdminsLoading]);

  useEffect(() => {
    if (users) {
      setUserRows(users);
    }
  }, [users, isUsersLoading]);

  useEffect(() => {
    if (admins) {
      let searches = search.split(" ");
      searches = searches.filter((s) => s.length > 0);

      const filteredRows = admins.filter((admin) => {
        return searches.some((s) => {
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
      setSearchAdminRows(search.length > 0 ? filteredRows : admins);
      setRows(search.length > 0 ? filteredRows : admins);
    }

    if (users) {
      let searches = search.split(" ");
      searches = searches.filter((s) => s.length > 0);

      const filteredRows = users.filter((user) => {
        return searches.some((s) => {
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

      setSearchUserRows(search.length > 0 ? filteredRows : users);
      setUserRows(search.length > 0 ? filteredRows : users);
    }
  }, [search, admins, users, tableTab]);

  const handleDeleteAdmin = async () => {
    setIsModalLoading(true);
    let response;
    if (modalData.user_type == "USER") {
      response = await deleteUsers(modalData.id);
    } else {
      response = await deleteAdmin(modalData.id);
    }

    if (!response) {
      toast(
        <Snackbar
          iconName="Error"
          size="snackbar-sm"
          color="destructive"
          message={`Failed to delete ${
            modalData.user_type == "USER" ? "user" : "admin"
          }`}
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
      // setIsLoading(false);
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

      // setIsLoading(false);
      return;
    }

    toast(
      <Snackbar
        iconName="CheckCircle"
        size="snackbar-sm"
        color="success"
        message={`${
          modalData.user_type == "USER" ? "User" : "Admin"
        } deleted successfully`}
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

    await log_activiy({
      user_id: user.id,
      entry: `Deleted ${modalData.user_type} : ${modalData.name}`,
      module: "User Management",
    });

    setIsModalLoading(false);
    setModalData({ id: "", name: "", user_type: "" });
  };

  const handleVerifyStatus = async (status) => {
    setVerificationLoading(true);
    const response = await verifyUser({ id: modalData.id, status });

    if (!response) {
      toast(
        <Snackbar
          iconName="Error"
          size="snackbar-sm"
          color="destructive"
          message={status ? "Failed to verify user" : "Failed to unverify user"}
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
      // setIsLoading(false);
      setVerificationLoading(false);
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

      setVerificationLoading(false);
      return;
    }

    toast(
      <Snackbar
        iconName="CheckCircle"
        size="snackbar-sm"
        color="success"
        message={`User ${status ? "verified" : "unverified"} successfully`}
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

    await log_activiy({
      user_id: user.id,
      entry: `${status ? "Verified" : "Unverified"} ${modalData.user_type} : ${
        modalData.name
      }`,
      module: "User Management",
    });

    setVerificationLoading(false);
    setModalData({ id: "", name: "", user_type: "" });
    if (status) {
      setVerifyModalActive(false);
    } else {
      setUnverifyModalActive(false);
    }
  };

  return (
    <>
      {isAdminsLoading || isUsersLoading ? (
        <SkeletonTable columns={9} />
      ) : (
        <div className="admin-wrapper flex flex-col h-full">
          <div className="header items-start md:items-center flex-col md:flex-row">
            <div className="breadcrumbs-wrapper">
              <div className="breadcrumb-item">
                <NavLink to="/dashboard/user-management">
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
            </div>
            <div className="flex items-start sm:items-center flex-col sm:flex-row mt-[20px] md:mt-0">
              <Input
                size="input-md"
                id="search"
                additionalClasses="w-full max-w-[328px]"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leadingIcon="Search"
                trailingIcon={search.length > 0 ? "Close" : undefined}
                onClickTrailing={
                  search.length > 0 ? () => setSearch("") : undefined
                }
              />
              <div className="flex flex-shrink-0 mt-[20px] sm:mt-0">
                <button className="prod-btn-base prod-btn-secondary flex justify-center items-center ms-0 sm:ms-[16px]">
                  <span>Print</span>

                  <Icon
                    iconName="Printer"
                    height="20px"
                    width="20px"
                    fill="#8693A0"
                    className="ms-[8px]"
                  />
                </button>
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
              </div>
            </div>
          </div>

          <div className="content">
            <Datatable
              datatableTabs={
                <UserManagementTabs
                  tabData={[
                    {
                      label: "Admins",
                      count:
                        search != "" ? searchAdminRows.length : admins.length,
                    },
                    {
                      label: "Users",
                      count:
                        search != "" ? searchUserRows.length : users.length,
                    },
                  ]}
                  currentTab={tableTab}
                  setCurrentTab={setTableTab}
                />
              }
              datatableColumns={
                tableTab == "Admins"
                  ? [
                      { label: "Full Name" },
                      { label: "Email", tooltip: "Sample tooltip" },
                      { label: "Date Created" },
                      { label: "User Type", tooltip: "Sample tooltip" },
                      { label: "Actions" },
                    ]
                  : tableTab == "Users"
                  ? [
                      { label: "Full Name" },
                      { label: "Email", tooltip: "Sample tooltip" },
                      { label: "Department " },
                      { label: "Organization ", tooltip: "Sample tooltip" },
                      { label: "Actions" },
                    ]
                  : [{ label: "Full Name" }]
              }
              datatableData={
                tableTab == "Admins"
                  ? search != ""
                    ? searchAdminRows
                    : admins
                  : search != ""
                  ? searchUserRows
                  : users
              }
              setDatatableData={
                tableTab == "Admins"
                  ? setRows
                  : tableTab == "Users"
                  ? setUserRows
                  : setRows
              }
              search={search}
              rowsPerPage={10}
              withActions={true}
              actionsWidth={
                ["ADMIN", "USER"].includes(user.user_type) ? "100px" : "170px"
              }
            >
              {tableTab == "Admins" ? (
                <AdminsData
                  user={user}
                  admins={admins}
                  rows={rows}
                  search={search}
                  setSearch={setSearch}
                  setModalData={setModalData}
                  setVerifyModalActive={setVerifyModalActive}
                  setUnverifyModalActive={setUnverifyModalActive}
                  setDeleteModalActive={setDeleteModalActive}
                />
              ) : (
                <UsersData
                  user={user}
                  users={users}
                  rows={userRows}
                  search={search}
                  setSearch={setSearch}
                  setModalData={setModalData}
                  setVerifyModalActive={setVerifyModalActive}
                  setUnverifyModalActive={setUnverifyModalActive}
                  setDeleteModalActive={setDeleteModalActive}
                />
              )}
            </Datatable>
          </div>
        </div>
      )}

      {/* MODALS */}

      {deleteModalActive && (
        <Modal
          onConfirm={async () => {
            await handleDeleteAdmin();
            setDeleteModalActive(false);
          }}
          onConfirmLabel="Delete"
          onCancel={() => {
            setModalData({ id: "", name: "", user_type: "" });
            setDeleteModalActive(false);
          }}
          onLoadingLabel="Deleting..."
          onLoading={isModalLoading}
          heading={`Are you sure you want to delete ${modalData.name}'s account?`}
          content="This user can never use their account to HealthPH anymore."
          color="destructive"
        />
      )}

      {verifyModalActive && (
        <Modal
          onLoading={verificationLoading}
          onLoadingLabel={"Verifying"}
          onConfirm={() => {
            handleVerifyStatus(true);
          }}
          onConfirmLabel="Verify"
          onCancel={() => {
            setModalData({ id: "", name: "", user_type: "" });
            setVerifyModalActive(false);
          }}
          heading={`Are you sure you want to verify ${modalData.name}'s account ?`}
          content="This user will receive full access to HealthPH such as the Analytics, Trends Map, and other modules."
          color="primary"
        />
      )}

      {unverifyModalActive && (
        <Modal
          onLoading={verificationLoading}
          onLoadingLabel={"Unverifying"}
          onConfirm={() => {
            handleVerifyStatus(false);
          }}
          onConfirmLabel="Unverify"
          onCancel={() => {
            setModalData({ id: "", name: "", user_type: "" });
            setUnverifyModalActive(false);
          }}
          heading={`Are you sure you want to unverify ${modalData.name}'s account ?`}
          content="This user will lose full access to HealthPH and can only access the Settings module."
          color="destructive"
        />
      )}
    </>
  );
};

const UserManagementTabs = ({ tabData, currentTab, setCurrentTab }) => {
  const formatDataLength = (value, minDigit) => {
    return value.length > minDigit
      ? value.toString().padStart(minDigit, "0").slice(0, minDigit)
      : value.toString().padStart(minDigit, "0");
  };

  return (
    <>
      <div className="datatable-tabs-wrapper">
        {tabData.map(({ label, count }, i) => {
          return (
            <div
              className={`datatable-tab-item ${
                currentTab == label ? "active" : ""
              }`}
              key={i}
              onClick={() => setCurrentTab(label)}
            >
              <h1>{label}</h1>
              <div className="count">{formatDataLength(count, 3)}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const AdminsData = ({
  user,
  admins,
  rows,
  search,
  setSearch,
  setModalData,
  setUnverifyModalActive,
  setVerifyModalActive,
  setDeleteModalActive,
}) => {
  return (
    <>
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
                is_verified,
              },
              i
            ) => {
              const searchWords = search.split(" ").filter((s) => s.length > 0);
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
                    {format(new Date(created_at), "MMM-dd-yyyy KK:mm a")}
                  </div>
                  <div className="row-item">{user_type}</div>
                  <div className="row-item">
                    {user && user.user_type == "USER" ? null : (
                      <div className="flex items-center">
                        <button
                          className={`prod-push-btn-sm prod-btn-${
                            is_verified ? "primary" : "secondary"
                          } me-[8px]  min-w-[63px]`}
                          onClick={() => {
                            setModalData({
                              id: id,
                              name: `${first_name} ${last_name}`,
                              user_type: user_type,
                            });

                            if (is_verified) {
                              setUnverifyModalActive(true);
                            } else {
                              setVerifyModalActive(true);
                            }
                          }}
                        >
                          {is_verified ? "Verified" : "Verify"}
                        </button>
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
          search != "" && (
            <EmptyState
              iconName="Search"
              heading="No Results Found"
              content="We couldn't find any matches for your search. Please try adjusting your search terms or criteria."
            >
              <button
                className="prod-btn-base prod-btn-secondary flex justify-center items-center"
                onClick={() => setSearch("")}
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
          {user.user_type == "SUPERADMIN" && (
            <NavLink
              to="/dashboard/admins/add-admin"
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
    </>
  );
};

const UsersData = ({
  user,
  users,
  rows,
  search,
  setSearch,
  setModalData,
  setUnverifyModalActive,
  setVerifyModalActive,
  setDeleteModalActive,
}) => {
  const displayDepartmentLevel = (level) => {
    let department_level = "";

    switch (level) {
      case "national":
        department_level = "National Level Office";
        break;
      case "regional":
        department_level = "Regional Level Office";
        break;
      case "provincial":
        department_level = "Provincial Level Office";
        break;
      case "city":
        department_level = "City Level Office";
        break;
      case "municipal":
        department_level = "City Level Office";
        break;
      default:
        department_level = "N / A";
    }

    return department_level;
  };
  return (
    <>
      {users.length > 0 ? (
        rows.length > 0 ? (
          rows.map(
            (
              {
                id,
                first_name,
                last_name,
                email,
                department_level,
                organization,
                is_verified,
                user_type,
              },
              i
            ) => {
              const searchWords = search.split(" ").filter((s) => s.length > 0);
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
                  <div className="row-item">
                    {displayDepartmentLevel(department_level)}
                  </div>
                  <div className="row-item">
                    <Highlighter
                      highlightClassName="bg-warning-500 font-medium"
                      searchWords={searchWords}
                      autoEscape={true}
                      textToHighlight={organization}
                    />
                  </div>
                  {/*  *
                  <div className="row-item">
                    {user && user.user_type == "USER" ? null : (
                      <button
                        className={`prod-push-btn-sm prod-btn-${
                          is_verified ? "primary" : "secondary"
                        }  min-w-[63px]`}
                        onClick={() => {
                          setModalData({
                            id: id,
                            name: `${first_name} ${last_name}`,
                            user_type: "USER",
                          });

                          if (is_verified) {
                            setUnverifyModalActive(true);
                          } else {
                            setVerifyModalActive(true);
                          }
                        }}
                      >
                        {is_verified ? "Verified" : "Verify"}
                      </button>
                    )}
                  </div>
                  {/*  */}
                  <div className="row-item">
                    {user && user.user_type == "USER" ? null : (
                      <div className="flex items-center">
                        <button
                          className={`prod-push-btn-sm prod-btn-${
                            is_verified ? "primary" : "secondary"
                          } me-[8px]  min-w-[63px]`}
                          onClick={() => {
                            setModalData({
                              id: id,
                              name: `${first_name} ${last_name}`,
                              user_type: user_type,
                            });

                            if (is_verified) {
                              setUnverifyModalActive(true);
                            } else {
                              setVerifyModalActive(true);
                            }
                          }}
                        >
                          {is_verified ? "Verified" : "Verify"}
                        </button>
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
          search != "" && (
            <EmptyState
              iconName="Search"
              heading="No Results Found"
              content="We couldn't find any matches for your search. Please try adjusting your search terms or criteria."
            >
              <button
                className="prod-btn-base prod-btn-secondary flex justify-center items-center"
                onClick={() => setSearch("")}
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
          content="No users are currently registered. Invite people to join and participate."
        />
      )}
    </>
  );
};
export default UserManagement;
