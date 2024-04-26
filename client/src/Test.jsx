import { forwardRef, useEffect, useRef } from "react";
import TestList from "./test.json";
import React, { useState, useCallback, useMemo } from "react";
import { useReactToPrint } from "react-to-print";
const Test = () => {
  let x = TestList;
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "<filename_when_saving_as_pdf>",
    pageStyle:
      "@page { size: A4;  margin: 0mm; color: 'red' } @media print { body { -webkit-print-color-adjust: exact; } }",
  });
  return (
    <>
      <div className="test-layout">
        <PrintComponent ref={printRef} columns={["A", "B", "C", "D", "E"]} />
        <button onClick={handlePrint}>PRINT</button>
      </div>
    </>
  );
};

const PrintComponent = forwardRef(({ columns }, ref) => {
  const numData = 50;
  return (
    <div className="print-component">
      <div className="print-container" ref={ref}>
        <div className="page">
          <div className="page-header mb-[36px]">
            <p>Page Name</p>
            <p>HealthPH</p>
          </div>
          <div
            className="page-content"
            style={{ "--page-columns": columns.length }}
          >
            <div className="content-header">
              <div className="flex items-center">
                <p>Table Name</p>
                <span className="ms-[8px]">000</span>
              </div>
              <p>As of MMM dd, YYYY</p>
            </div>
            <div className="row-header">
              {Array.from({ length: columns.length }).map((v, i) => {
                return (
                  <div key={i} className="row-item">
                    {columns[i]}
                  </div>
                );
              })}
            </div>
            <div className="row">
              {Array.from({ length: columns.length }).map((v, i) => {
                return (
                  <div key={i} className="row-item">
                    {columns[i]}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="page-footer mt-[36px]">
            <p>Row 0 - 0 of 00</p>
            <p>Page 00 </p>
          </div>
        </div>
        <div className="page">
          <div className="page-header mb-[36px]">
            <p>Page Name</p>
            <p>HealthPH</p>
          </div>
          <div className="page-content">s</div>
          <div className="page-footer mt-[36px]">
            <p>Row 0 - 0 of 00</p>
            <p>Page 00 </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Test;
