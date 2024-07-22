import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";

import SkeletonTable from "../../components/SkeletonTable";
import Icon from "../../components/Icon";
import Input from "../../components/Input";
import PrintComponent from "../../components/admin/PrintComponent";
import AdminsTable from "../../components/admin/AdminsTable";
import UsersTable from "../../components/admin/UsersTable";

import {
  useFetchAdminsQuery,
  useFetchUsersQuery,
} from "../../features/api/userSlice";

const UserManagement = () => {
  const user = useSelector((state) => state.auth.user);

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

  const [searchQuery, setSearchQuery] = useState("");

  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "HealthPH - User Management",
    pageStyle:
      "@page { size: A4;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }",
  });

  const [tabs, setTabs] = useState([
    { label: "Admins", count: 0 },
    { label: "Users", count: 0 },
  ]);

  const [currentTableTab, setCurrentTableTab] = useState(
    user.user_type == "SUPERADMIN" ? "Admins" : "Users"
  );

  useEffect(() => {
    if (admins && users) {
      if (searchQuery) {
        let searchQuerySplit = searchQuery.split(" ");
        searchQuerySplit = searchQuerySplit.filter((s) => s.length > 0);

        const filteredAdmins = admins.filter((admin) => {
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

        const filteredUsers = users.filter((user) => {
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

        setTabs([
          { label: "Admins", count: filteredAdmins.length },
          { label: "Users", count: filteredUsers.length },
        ]);
      } else {
        setTabs([
          { label: "Admins", count: admins.length },
          { label: "Users", count: users.length },
        ]);
      }
    }
  }, [searchQuery, isAdminsLoading, isUsersLoading]);

  const [currentAdminsData, setCurrentAdminsData] = useState([]);

  const [currentUsersData, setCurrentUsersData] = useState([]);

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
            <div className="flex items-start sm:items-center flex-col sm:flex-row mt-[20[x] md:mt-0">
              <Input
                size="input-md"
                id="search"
                additionalClasses="w-full max-w-[328px]"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leadingIcon="Search"
                trailingIcon={searchQuery.length > 0 ? "Close" : undefined}
                onClickTrailing={
                  searchQuery.length > 0 ? () => setSearchQuery("") : undefined
                }
              />
              <div className="flex flex-shrink-0 mt-[20px] sm:mt-0">
                <button
                  className="prod-btn-base prod-btn-secondary flex justify-center items-center ms-0 sm:ms-[16px]"
                  onClick={handlePrint}
                >
                  <span>Print</span>

                  <Icon
                    iconName="Printer"
                    height="20px"
                    width="20px"
                    fill="#8693A0"
                    className="ms-[8px]"
                  />
                </button>

                {/* PRINT COMPONENT */}
                <PrintComponent
                  ref={printRef}
                  pageName="User Management"
                  tableName={currentTableTab}
                  data={
                    currentTableTab == "Admins"
                      ? currentAdminsData
                      : currentUsersData
                  }
                  columns={
                    currentTableTab == "Admins"
                      ? ["FULL NAME", "EMAIL", "USER TYPE", "DATE CREATED"]
                      : [
                          "FULL NAME",
                          "EMAIL",
                          "REGIONAL OFFICE",
                          "ORGANIZATION",
                          "DATE CREATED",
                        ]
                  }
                  rowsPerPage={25}
                  dateTable={format(new Date(), "MMMM dd, yyyy")}
                  displayFunc={(value) => {
                    let full_name = `${value.first_name} ${value.last_name}`;

                    let data = [full_name, value.email];
                    if (currentTableTab == "Admins") {
                      data.push(value.user_type);
                    } else {
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
                        BARMM:
                          "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)",
                      };
                      data.push(regions[value.region]);
                      data.push(value.organization);
                    }
                    data.push(
                      format(new Date(value.created_at), "MMM dd, yyyy hh:mm a")
                    );
                    return data;
                  }}
                />
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
            {currentTableTab == "Admins" ? (
              <AdminsTable
                admins={admins}
                tableTabs={
                  <UserManagementTabs
                    tabs={
                      user.user_type == "SUPERADMIN"
                        ? tabs
                        : tabs.filter((t) => t.label == "Users")
                    }
                    currentTab={currentTableTab}
                    setCurrentTab={setCurrentTableTab}
                  />
                }
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setCurrentData={setCurrentAdminsData}
              />
            ) : (
              <UsersTable
                users={users}
                tableTabs={
                  <UserManagementTabs
                    tabs={
                      user.user_type == "SUPERADMIN"
                        ? tabs
                        : tabs.filter((t) => t.label == "Users")
                    }
                    currentTab={currentTableTab}
                    setCurrentTab={setCurrentTableTab}
                  />
                }
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setCurrentData={setCurrentUsersData}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

const UserManagementTabs = ({ tabs, currentTab, setCurrentTab }) => {
  const formatDataLength = (value, minDigit) => {
    return value.length > minDigit
      ? value.toString().padStart(minDigit, "0").slice(0, minDigit)
      : value.toString().padStart(minDigit, "0");
  };

  return (
    <>
      <div className="datatable-tabs-wrapper">
        {tabs.map(({ label, count }, i) => {
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

export default UserManagement;
