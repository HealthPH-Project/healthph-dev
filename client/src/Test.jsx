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
        <PrintComponent ref={printRef} />
        <button onClick={handlePrint}>PRINT</button>
      </div>
    </>
  );
};

const PrintComponent = forwardRef((props, ref) => {
  return (
    <div className="print-component">
      <div className="print-container" ref={ref}>
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
