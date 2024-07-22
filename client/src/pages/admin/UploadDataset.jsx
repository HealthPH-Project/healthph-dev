import { Link, NavLink, useNavigate } from "react-router-dom";
import Icon from "../../components/Icon";
import { useEffect, useRef, useState } from "react";
import Datatable from "../../components/admin/Datatable";
import {
  useCreateActivityLogMutation,
  useFetchActivityLogsQuery,
} from "../../features/api/activityLogsSlice";
import EmptyState from "../../components/admin/EmptyState";
import { format } from "date-fns";
import CSVReader from "react-csv-reader";
import SkeletonBody from "../../components/SkeletonBody";
import {
  useDeleteDatasetMutation,
  useFetchDatasetsQuery,
  useUploadFileMutation,
} from "../../features/api/datasetsSlice";
import Modal from "../../components/admin/Modal";
import { toast } from "react-toastify";
import Snackbar from "../../components/Snackbar";
import { useSelector } from "react-redux";

const UploadDataset = () => {
  const user = useSelector((state) => state.auth.user);

  const inputFile = useRef(null);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [uploadModalActive, setUploadModalActive] = useState(false);

  const [isUploadLoading, setIsUploadLoading] = useState(false);

  const [previewData, setPreviewData] = useState({
    filename: "",
    rows: 0,
    headers: [],
    data: [],
  });

  const [file, setFile] = useState(null);

  const onFileSelect = (data, fileInfo, originalFile) => {
    if (fileInfo.type != "text/csv") {
      toast(
        <Snackbar
          iconName="Error"
          size="snackbar-sm"
          color="destructive"
          message="Invalid file type"
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
      inputFile.current.value = "";
      return;
    }

    if (data.length == 0) {
      toast(
        <Snackbar
          iconName="Error"
          size="snackbar-sm"
          color="destructive"
          message="Invalid file uploaded"
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
      inputFile.current.value = "";
      return;
    }

    setFile(originalFile);

    setPreviewData({
      filename: fileInfo.name,
      rows: data.length,
      headers: Object.keys(data[0]),
      data: data.slice(0, 3),
    });

    setUploadModalActive(true);
  };

  const [uploadDataset] = useUploadFileMutation();

  const handleUploadDataset = async () => {
    setIsUploadLoading(true);

    const payload = new FormData();

    payload.append("file", file);

    const response = await uploadDataset(payload);

    if (!response) {
      toast(
        <Snackbar
          iconName="Error"
          size="snackbar-sm"
          color="destructive"
          message={`Failed to upload dataset`}
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
      setIsUploadLoading(false);
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

      setIsUploadLoading(false);
      return;
    }

    toast(
      <Snackbar
        iconName="CheckCircle"
        size="snackbar-sm"
        color="success"
        message={`Dataset uploaded successfully`}
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
      entry: `Uploaded dataset: ${previewData.filename}`,
      module: "Trends Map",
    });

    setIsUploadLoading(false);

    setPreviewData({
      filename: "",
      rows: 0,
      headers: [],
      data: [],
    });

    setFile(null);

    document.getElementById("react-csv-reader-input").value = "";
  };

  const {
    data: datasets,
    isLoading: isDatasetsLoading,
    isFetching,
  } = useFetchDatasetsQuery();

  const [deleteDataset] = useDeleteDatasetMutation();

  const [log_activiy] = useCreateActivityLogMutation();

  const [rows, setRows] = useState([]);

  const [deleteModalActive, setDeleteModalActive] = useState(false);

  const [modalData, setModalData] = useState({
    id: "",
    filename: "",
  });

  const [isModalLoading, setIsModalLoading] = useState(false);

  const displayFileSize = (size) => {
    if (size < 1024) {
      return `${size} B`;
    } else {
      const new_size = size / 1024;
      if (new_size >= 1024) {
        return `${(new_size / 1024).toFixed(2).replace(/\.?0+$/, "")} MB`;
      }
      return `${new_size.toFixed(2).replace(/\.?0+$/, "")} KB`;
    }
  };

  const handleDeleteDataset = async () => {
    setIsModalLoading(true);

    const response = await deleteDataset(modalData.id);

    if (!response) {
      toast(
        <Snackbar
          iconName="Error"
          size="snackbar-sm"
          color="destructive"
          message={`Failed to delete dataset`}
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
        message={`Dataset deleted successfully`}
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
      entry: `Deleted dataset: ${modalData.filename}`,
      module: "Trends Map",
    });

    setIsModalLoading(false);

    setModalData({ id: "", filename: "" });

    setFile(null);
  };

  const [previewModalActive, setPreviewModalActive] = useState(false);

  const [previewModalData, setPreviewModalData] = useState({
    filename: "",
    num_of_rows: 0,
    preview_headers: [],
    preview_data: [],
  });

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
                  <Link
                    to="/assets/dataset-template.csv"
                    target="_blank"
                    className="prod-btn-base prod-btn-secondary"
                  >
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
          {isFetching ? (
            <div className="overflow-y-hidden min-w-full h-[642px]">
              <SkeletonBody columns={9} />
            </div>
          ) : (
            <div className="content h-[642px]">
              <Datatable
                datatableHeader="Datasets"
                datatableColumns={[
                  { label: "File Name" },
                  { label: "File Size" },
                  { label: "Uploaded By" },
                  { label: "Date Uploaded" },
                  { label: "Actions" },
                ]}
                datatableData={datasets}
                setDatatableData={setRows}
                rowsPerPage={10}
                withActions={true}
                actionsWidth="260px"
              >
                {datasets.length > 0 ? (
                  rows.map(
                    (
                      {
                        id,
                        user_name,
                        filename,
                        original_filename,
                        file_size,
                        num_of_rows,
                        preview_data,
                        preview_headers,
                        created_at,
                      },
                      i
                    ) => {
                      const download_link =
                        import.meta.env.VITE_API_URL +
                        "/datasets/download/" +
                        filename;
                      return (
                        <div className="content-row" key={i}>
                          <div className="row-item">{original_filename}</div>
                          <div className="row-item">
                            {displayFileSize(file_size)}
                          </div>
                          <div className="row-item">{user_name}</div>
                          <div className="row-item">
                            {format(
                              new Date(created_at),
                              "MMM dd, yyyy hh:mm a"
                            )}
                          </div>
                          <div className="row-item">
                            <div className="flex items-center">
                              <button
                                className="prod-push-btn-sm prod-btn-primary me-[8px] min-w-[70px]"
                                onClick={() => {
                                  setPreviewModalData({
                                    filename: original_filename,
                                    num_of_rows: num_of_rows,
                                    preview_headers: preview_headers,
                                    preview_data: JSON.parse(preview_data),
                                  });
                                  setPreviewModalActive(true);
                                }}
                              >
                                Preview
                              </button>
                              <a
                                href={download_link}
                                target="_blank"
                                className="prod-push-btn-sm prod-btn-secondary me-[8px] min-w-[70px]"
                              >
                                Download
                              </a>
                              <button
                                className="prod-push-btn-sm prod-btn-destructive min-w-[70px]"
                                onClick={() => {
                                  setModalData({ id: id, filename: filename });
                                  setDeleteModalActive(true);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )
                ) : (
                  <EmptyState
                    iconName="Document"
                    heading="No Datasets Uploaded"
                    content="There are no datasets uploaded. Upload a dataset to be displayed in Trends Map"
                  >
                    <button
                      className="prod-btn-base prod-btn-primary"
                      onClick={() => inputFile.current.click()}
                    >
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
                  disabled={isUploadLoading}
                >
                  Cancel
                </button>
              )}
              <button
                className={`prod-btn-base prod-btn-primary mb-[16px] sm:mb-0`}
                onClick={async () => {
                  await handleUploadDataset();
                  setUploadModalActive(false);
                }}
                disabled={isUploadLoading}
              >
                {isUploadLoading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {previewModalActive && (
        <div className="upload-modal">
          <div className="modal-backdrop"></div>
          <div className="modal-container">
            <div className="modal-body">
              <div className="modal-heading">Dataset Preview</div>
            </div>
            <div className="modal-data">
              <p className="mb-[8px]">
                Filename: <span>{previewModalData.filename}</span>
              </p>
              <p>
                Number of Rows: <span>{previewModalData.num_of_rows}</span>
              </p>
              <div
                className="preview-wrapper"
                style={{
                  "--preview-cols":
                    previewModalData.preview_headers.length > 3
                      ? 3
                      : previewModalData.preview_headers.length,
                }}
              >
                <div className="preview-row row-header">
                  {previewModalData.preview_headers
                    .slice(
                      0,
                      previewModalData.preview_headers.length > 3
                        ? 3
                        : previewModalData.preview_headers.length
                    )
                    .map((v, i) => {
                      return (
                        <div className="row-item" key={i}>
                          {v}
                        </div>
                      );
                    })}
                </div>
                {previewModalData.preview_data.map((v, i) => {
                  return (
                    <div className="preview-row pt-[8px]" key={i}>
                      {Object.keys(v)
                        .slice(
                          0,
                          previewModalData.preview_headers.length > 3
                            ? 3
                            : previewModalData.preview_headers.length
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
              <button
                className="prod-btn-base prod-btn-secondary me-0 sm:me-[16px]"
                onClick={() => {
                  setPreviewModalActive(false);
                  setPreviewModalData({
                    filename: "",
                    num_of_rows: 0,
                    preview_headers: [],
                    preview_data: [],
                  });
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModalActive && (
        <Modal
          onConfirm={async () => {
            await handleDeleteDataset();
            setDeleteModalActive(false);
          }}
          onConfirmLabel="Delete"
          onCancel={() => {
            setModalData({ id: "", filename: "" });
            setDeleteModalActive(false);
          }}
          onLoadingLabel="Deleting..."
          onLoading={isModalLoading}
          heading={`Are you sure you want to delete the following dataset: [${modalData.filename}]?`}
          content="This will remove the file from the system and this action can't be undone."
          color="destructive"
        />
      )}
    </>
  );
};
export default UploadDataset;
