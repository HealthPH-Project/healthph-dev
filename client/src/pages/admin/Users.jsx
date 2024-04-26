import { useEffect, useState } from "react";
import {
  useFetchUsersQuery,
  useVerifyUserMutation,
} from "../../features/api/userSlice";
import { useCreateActivityLogMutation } from "../../features/api/activityLogsSlice";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import Icon from "../../components/Icon";
import Input from "../../components/Input";
import Datatable from "../../components/admin/Datatable";
import SkeletonTable from "../../components/SkeletonTable";
import Modal from "../../components/admin/Modal";
import { toast } from "react-toastify";
import Snackbar from "../../components/Snackbar";
import Highlighter from "react-highlight-words";
import EmptyState from "../../components/admin/EmptyState";

const Users = () => {
  const user = useSelector((state) => state.auth.user);

  const [search, setSearch] = useState("");

  const { data: users, isLoading, isError } = useFetchUsersQuery();

  const [rows, setRows] = useState([]);

  const [verificationLoading, setVerificationLoading] = useState(false);

  const [verifyModalActive, setVerifyModalActive] = useState(false);

  const [unverifyModalActive, setUnverifyModalActive] = useState(false);

  const [modalData, setModalData] = useState({
    id: "",
    name: "",
  });

  const [verifyUser] = useVerifyUserMutation();

  const [log_activity] = useCreateActivityLogMutation();

  useEffect(() => {
    if (users) {
      setRows(users);
    }
  }, [users, isLoading]);

  useEffect(() => {
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

      setRows(search.length > 0 ? filteredRows : users);
    }
  }, [search, users]);

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

  const handleVerifyStatus = async (status) => {
    setVerificationLoading(true);
    const response = await verifyUser({ id: modalData.id, status });

    if (!response) {
      toast(
        <Snackbar
          iconName="Error"
          size="snackbar-sm"
          color="destructive"
          message="Failed to verify user"
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

    await log_activity({
      user_id: user.id,
      entry: `${status ? "Verified" : "Unverified"} user : ${modalData.name}`,
      module: "Users",
    });

    setVerificationLoading(false);
    setModalData({ id: "", name: "" });
    if (status) {
      setVerifyModalActive(false);
    } else {
      setUnverifyModalActive(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTable columns={9} />
      ) : (
        <div className="admin-wrapper flex flex-col h-full">
          <div className="header items-start sm:items-center flex-col sm:flex-row">
            <div className="breadcrumbs-wrapper">
              <div className="breadcrumb-item">
                <NavLink to="/dashboard/users">Users</NavLink>
                <Icon
                  iconName="ChevronRight"
                  height="16px"
                  width="16px"
                  fill="#A1ACB8"
                  className="icon"
                />
              </div>
            </div>
            <div className="flex items-center mt-[20px] sm:mt-0">
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
              <button className="prod-btn-base prod-btn-secondary flex justify-center items-center ms-[16px]">
                <span>Print</span>

                <Icon
                  iconName="Printer"
                  height="20px"
                  width="20px"
                  fill="#8693A0"
                  className="ms-[8px]"
                />
              </button>
            </div>
          </div>

          <div className="content">
            <Datatable
              datatableHeader="Users"
              datatableColumns={[
                { label: "Full Name" },
                { label: "Email", tooltip: "Sample tooltip" },
                { label: "Department " },
                { label: "Organization ", tooltip: "Sample tooltip" },
                { label: "Actions" },
              ]}
              datatableData={users}
              setDatatableData={setRows}
              rowsPerPage={10}
              withActions={true}
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
                        department_level,
                        organization,
                        is_verified,
                      },
                      i
                    ) => {
                      const searchWords = search
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
                          <div className="row-item">
                            <button
                              className={`prod-push-btn-sm prod-btn-${
                                is_verified ? "primary" : "secondary"
                              }  min-w-[63px]`}
                              onClick={() => {
                                setModalData({
                                  id: id,
                                  name: `${first_name} ${last_name}`,
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
            </Datatable>
          </div>
        </div>
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
            setModalData({ id: "", name: "" });
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
            setModalData({ id: "", name: "" });
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
export default Users;
