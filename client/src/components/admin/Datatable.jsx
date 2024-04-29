import { useEffect, useState } from "react";
import Icon from "../Icon";
import EmptyState from "./EmptyState";

const Datatable = ({
  datatableHeader,
  datatableTabs,
  datatableColumns,
  datatableData,
  setDatatableData,
  rowsPerPage,
  withActions,
  actionsWidth,
  children,
  noOfData = datatableData.length,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  // const noOfData = datatableData.length;

  const totalPages = Math.ceil(noOfData / rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [datatableData]);

  useEffect(() => {
    setDatatableData(
      datatableData.slice(
        currentPage * rowsPerPage - rowsPerPage,
        rowsPerPage * currentPage
      )
    );
  }, [currentPage]);

  const formatDataLength = (value, minDigit) => {
    return value.length > minDigit
      ? value.toString().padStart(minDigit, "0").slice(0, minDigit)
      : value.toString().padStart(minDigit, "0");
  };

  const displayPageRange = () => {
    const startIndex =
      noOfData == 0 ? 0 : currentPage * rowsPerPage - rowsPerPage + 1;
    const endIndex =
      currentPage * rowsPerPage < noOfData
        ? currentPage * rowsPerPage
        : noOfData;

    return `${startIndex} - ${endIndex} of ${noOfData}`;
  };

  return (
    <div className="datatable">
      {/* HEADER */}
      {datatableHeader && (
        <div className="datatable-header">
          <h1>{datatableHeader}</h1>
          <div className="count">{formatDataLength(noOfData, 3)}</div>
        </div>
      )}

      {datatableTabs && <div className="datatable-tabs">{datatableTabs}</div>}

      {/* BODY */}
      <div
        className={`datatable-body ${
          withActions ? "datatable-body-actions" : ""
        }`}
        style={{
          "--columns": datatableColumns.length,
          "--actions-width": actionsWidth ?? "120px",
        }}
      >
        {datatableData.length > 0 && (
          <div className="datatable-body-header">
            {datatableColumns.map(({ label, tooltip }, i) => {
              return (
                <div key={i} className="header-item">
                  <div className="flex items-center">
                    <span>{label.toString().toUpperCase()}</span>
                    {tooltip && (
                      <div className="column-tooltip">
                        <Icon
                          iconName="Information"
                          height="16px"
                          width="16px"
                          fill="#8693A0"
                        />
                        <div className="tooltip">{tooltip}</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="datatable-body-content">{children}</div>
      </div>

      {/* FOOTER */}
      <div className="datatable-footer">
        <div className="range">{displayPageRange()}</div>
        <div className="pagination">
          <button
            className="prod-icon-btn prod-icon-btn-sm prod-btn-secondary"
            onClick={() => {
              setCurrentPage(currentPage - 1);
            }}
            disabled={currentPage == 1}
          >
            <Icon iconName="ArrowLeft" fill="#465360" className="icon" />
          </button>
          <div className="pagination-page">
            <span className="current-page">
              {formatDataLength(noOfData > 0 ? currentPage : 0, 2)}
            </span>
            /{formatDataLength(totalPages, 2)}
          </div>
          <button
            className="prod-icon-btn prod-icon-btn-sm prod-btn-secondary"
            onClick={() => {
              setCurrentPage(currentPage + 1);
            }}
            disabled={currentPage == totalPages}
          >
            <Icon iconName="ArrowRight" fill="#465360" className="icon" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Datatable;
