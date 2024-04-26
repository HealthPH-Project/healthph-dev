import { Link, NavLink, useNavigate } from "react-router-dom";
import Icon from "../../components/Icon";
import { useRef, useState } from "react";
import Datatable from "../../components/admin/Datatable";
import { useFetchActivityLogsQuery } from "../../features/api/activityLogsSlice";
import EmptyState from "../../components/admin/EmptyState";
import { format } from "date-fns";
import CSVReader from "react-csv-reader";

const UploadDataset = () => {
  const inputFile = useRef(null);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [uploadModalActive, setUploadModalActive] = useState(false);

  const [previewData, setPreviewData] = useState({
    filename: "",
    rows: 0,
    headers: [],
    data: [],
  });

  const onFileSelect = (data, fileInfo) => {
    console.log(data.slice(0, 3), fileInfo);
    setPreviewData({
      filename: fileInfo.name,
      rows: data.length,
      headers: Object.keys(data[0]),
      data: data.slice(0, 3),
    });
    setUploadModalActive(true);
  };

  const {
    data: activity_logs,
    error,
    isSuccess,
    isError,
    isLoading: isDataLoading,
  } = useFetchActivityLogsQuery();

  const [rows, setRows] = useState([]);

  return (
    <>
      <div className="admin-wrapper flex flex-col h-full">
        <div className="header items-start md:items-center flex-col md:flex-row">
          <div className="breadcrumbs-wrapper">
            <div className="breadcrumb-item">
              <NavLink to="/dashboard/trends-map" end>
                Trends Map
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
              <NavLink to="/dashboard/trends-map/upload-dataset">
                Upload Dataset
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
        <div className="pb-[20px]">
          <form method="post">
            <div className="settings-header">
              <div className="max-w-[360px]">
                <p>Upload Dataset</p>
                <span>
                  All current and previous CSV data sets are uploaded here.
                  Download the 'CSV Template' to fill out the data columns then
                  proceed to upload it.
                </span>
                <div className="mt-[16px]">
                  <Link to="#" className="prod-btn-base prod-btn-secondary">
                    Download CSV Template
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  className="prod-btn-base prod-btn-secondary me-[16px]"
                  onClick={() => {
                    navigate("/dashboard/trends-map", { replace: true });
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="prod-btn-base prod-btn-primary"
                  onClick={() => inputFile.current.click()}
                >
                  Upload CSV
                </button>
                <CSVReader
                  parserOptions={{ header: true }}
                  onFileLoaded={onFileSelect}
                  ref={inputFile}
                  cssInputClass="hidden"
                />
              </div>
            </div>
          </form>
          {isDataLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="content h-[642px]">
              <Datatable
                datatableHeader="Datasets"
                datatableColumns={[
                  { label: "File Name" },
                  { label: "File Size", tooltip: "Sample tooltip" },
                  { label: "Date Uploaded" },
                  { label: "Uploaded By" },
                  { label: "Actions" },
                ]}
                datatableData={[]}
                setDatatableData={setRows}
                rowsPerPage={10}
                withActions={true}
                actionsWidth="190px"
              >
                {[].length > 0 ? (
                  rows.map(({ user_name, entry, module, created_at }, i) => {
                    return (
                      <div className="content-row" key={i}>
                        <div className="row-item">{user_name}</div>
                        <div className="row-item">{entry}</div>
                        <div className="row-item">{module}</div>
                        <div className="row-item">
                          {format(new Date(created_at), "MMM-dd-yyyy KK:mm a")}
                        </div>
                        <div className="row-item">
                          <div className="flex items-center">
                            <Link
                              to="#"
                              className="prod-push-btn-sm prod-btn-secondary me-[8px] min-w-[70px]"
                            >
                              Download
                            </Link>
                            <button className="prod-push-btn-sm prod-btn-destructive min-w-[70px]">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <EmptyState
                    iconName="Document"
                    heading="No Datasets Uploaded"
                    content="There are no datasets uploaded. Upload a dataset to be displayed in Trends Map"
                  >
                    <button className="prod-btn-base prod-btn-primary">
                      Upload Dataset
                    </button>
                  </EmptyState>
                )}
              </Datatable>
            </div>
          )}
        </div>
      </div>

      {uploadModalActive && (
        <div className="upload-modal">
          <div className="modal-backdrop"></div>
          <div className="modal-container">
            <div className="modal-body">
              <div className="modal-heading">
                Are you sure you want to upload this data set?
              </div>
            </div>
            <div className="modal-data">
              <p className="mb-[8px]">
                Filename: <span>{previewData.filename}</span>
              </p>
              <p>
                Number of Rows: <span>{previewData.rows}</span>
              </p>
              <div
                className="preview-wrapper"
                style={{
                  "--preview-cols":
                    previewData.headers.length > 3
                      ? 3
                      : previewData.headers.length,
                }}
              >
                <div className="preview-row row-header">
                  {previewData.headers
                    .slice(
                      0,
                      previewData.headers.length > 3
                        ? 3
                        : previewData.headers.length
                    )
                    .map((v, i) => {
                      return (
                        <div className="row-item" key={i}>
                          {v}
                        </div>
                      );
                    })}
                </div>
                {previewData.data.map((v, i) => {
                  return (
                    <div className="preview-row pt-[8px]" key={i}>
                      {Object.keys(v)
                        .slice(
                          0,
                          previewData.headers.length > 3
                            ? 3
                            : previewData.headers.length
                        )
                        .map((x, j) => {
                          return (
                            <div className="row-item" key={j}>
                              {v[x]}
                            </div>
                          );
                        })}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="modal-actions">
              {true && (
                <button
                  className="prod-btn-base prod-btn-secondary me-0 sm:me-[16px]"
                  onClick={() => {
                    inputFile.current.value = "";
                    setUploadModalActive(false);
                    setPreviewData({
                      filename: "",
                      rows: 0,
                      headers: [],
                      data: [],
                    });
                  }}
                  //   disabled={onLoading}
                >
                  Cancel
                </button>
              )}
              <button
                className={`prod-btn-base prod-btn-primary mb-[16px] sm:mb-0`}
                //   onClick={onConfirm}
                //   disabled={onLoading}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default UploadDataset;
