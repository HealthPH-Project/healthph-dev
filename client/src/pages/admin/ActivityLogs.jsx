import { NavLink, useNavigate } from "react-router-dom";
import Icon from "../../components/Icon";
import Input from "../../components/Input";
import { useEffect, useRef, useState } from "react";
import Datatable from "../../components/admin/Datatable";
import {
  useCreateActivityLogMutation,
  useFetchActivityLogsQuery,
} from "../../features/api/activityLogsSlice";
import { format } from "date-fns";
import SkeletonTable from "../../components/SkeletonTable";
import EmptyState from "../../components/admin/EmptyState";
import Highlighter from "react-highlight-words";
import { useReactToPrint } from "react-to-print";
import PrintComponent from "../../components/admin/PrintComponent";
import { useSelector } from "react-redux";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { toPng } from "html-to-image";
import Snackbar from "../../components/Snackbar";
import { toast } from "react-toastify";

const ActivityLogs = () => {
  const auth = useSelector((state) => state.auth);

  const [log_activity] = useCreateActivityLogMutation();

  const [search, setSearch] = useState("");

  const {
    data: activity_logs,
    error,
    isSuccess,
    isError,
    isLoading,
  } = useFetchActivityLogsQuery();

  const [rows, setRows] = useState([]);

  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    if (activity_logs) {
      setRowData(activity_logs);
    }
  }, [activity_logs]);

  useEffect(() => {
    setRows(rowData.slice(0, 10));
  }, [rowData]);

  useEffect(() => {
    if (activity_logs) {
      let searches = search.split(" ");
      searches = searches.filter((s) => s.length > 0);

      const filteredRows = activity_logs.filter((log) => {
        return searches.some((s) => {
          const reg = new RegExp("^.*" + s + ".*$", "i");
          if (
            reg.test(log["user_name"]) ||
            reg.test(log["entry"]) ||
            reg.test(log["module"])
          ) {
            return true;
          }
        });
      });

      setRowData(search.length > 0 ? filteredRows : activity_logs);
    }
  }, [search]);

  const printRef = useRef();

  const { deviceType } = useDeviceDetect();

  const [showPrint, setShowPrint] = useState(false);

  const navigate = useNavigate();

  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    if (["mobile", "tablet"].includes(deviceType)) {
      setShowPrint(true);
      setTimeout(handleExportActivityLogs, 1000);
    } else {
      setTimeout(handlePrintActivityLogs, 1000);
    }
  };

  const handlePrintActivityLogs = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "HealthPH - Activity Logs",
    pageStyle:
      "@page { size: A4;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }",
    onAfterPrint: () => {
      setIsPrinting(false);
      document.getElementById("printWindow").remove();

      log_activity({
        user_id: auth.user.id,
        entry: "Generated Activity Logs report",
        module: "Activity Logs",
      });
    },
  });

  const handleExportActivityLogs = async () => {
    try {
      const pages = document.querySelectorAll(".print-container .page");

      let imageList = [];

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];

        const imageData = await toPng(page, {
          canvasWidth: page.offsetWidth * 2,
          canvasHeight: page.offsetHeight * 2,
          quality: 1,
          pixelRatio: 1,
        });

        imageList.push(imageData);
      }

      setIsPrinting(false);

      navigate("/print", {
        state: {
          data: {
            documentTitle: "HealthPH - Activity Logs",
            imageType: "list",
            imageData: imageList,
            log_activity: {
              user_id: auth.user.id,
              entry: "Generated Activity Logs report",
              module: "Activity Logs",
            },
          },
        },
      });
    } catch (error) {
      toast(
        <Snackbar
          iconName="Error"
          size="snackbar-sm"
          color="destructive"
          message={"Failed to generate report. Please try again."}
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
                <NavLink to="/dashboard/activity-logs">Activity Logs</NavLink>
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
              <button
                className="prod-btn-base prod-btn-secondary flex justify-center items-center ms-[16px]"
                onClick={handlePrint}
                disabled={isPrinting}
              >
                {isPrinting ? (
                  <span>Printing...</span>
                ) : (
                  <>
                    <span>Print</span>

                    <Icon
                      iconName="Printer"
                      height="20px"
                      width="20px"
                      fill="#8693A0"
                      className="ms-[8px]"
                    />
                  </>
                )}
              </button>
              <PrintComponent
                showPrint={showPrint}
                ref={printRef}
                pageName="Activity Logs"
                tableName="Activity Logs"
                data={rowData}
                columns={["USER", "ENTRY", "MODULE", "LOGGED AT"]}
                rowsPerPage={23}
                dateTable={format(new Date(), "MMMM dd, yyyy | hh:mm a")}
                displayFunc={(value) => {
                  let data = [value.user_name, value.entry, value.module];
                  data.push(
                    format(new Date(value.created_at), "MMM dd, yyyy hh:mm a")
                  );
                  return data;
                }}
              />
            </div>
          </div>
          <div className="content">
            <Datatable
              datatableHeader="User Activities"
              datatableColumns={[
                { label: "User" },
                { label: "Entry", tooltip: "Sample tooltip" },
                { label: "Module" },
                { label: "Logged At" },
              ]}
              datatableData={rowData}
              setDatatableData={setRows}
              rowsPerPage={10}
            >
              {activity_logs.length > 0 ? (
                rows.length > 0 ? (
                  rows.map(({ user_name, entry, module, created_at }, i) => {
                    const searchWords = search
                      .split(" ")
                      .filter((s) => s.length > 0);
                    return (
                      <div className="content-row" key={i}>
                        <div className="row-item">
                          <Highlighter
                            highlightClassName="bg-[#FFE81A] text-[#000] font-medium rounded-[2px] p-[2px]"
                            searchWords={searchWords}
                            autoEscape={true}
                            textToHighlight={user_name}
                          />
                        </div>
                        <div className="row-item">
                          <Highlighter
                            highlightClassName="bg-[#FFE81A] text-[#000] font-medium rounded-[2px] p-[2px]"
                            searchWords={searchWords}
                            autoEscape={true}
                            textToHighlight={entry}
                          />
                        </div>
                        <div className="row-item">
                          <Highlighter
                            highlightClassName="bg-[#FFE81A] text-[#000] font-medium rounded-[2px] p-[2px]"
                            searchWords={searchWords}
                            autoEscape={true}
                            textToHighlight={module}
                          />
                        </div>
                        <div className="row-item">
                          {format(new Date(created_at), "MMM dd, yyyy hh:mm a")}
                        </div>
                      </div>
                    );
                  })
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
                  iconName="ActivityLog"
                  heading="No Activities Logged"
                  content="Activities and actions will be recorded here to help you track engagement and progress."
                />
              )}
            </Datatable>
          </div>
        </div>
      )}
    </>
  );
};
export default ActivityLogs;
