import { forwardRef, useEffect, useRef } from "react";
import TestList from "./test.json";
import React, { useState, useCallback, useMemo } from "react";
import { useReactToPrint } from "react-to-print";
const Test = () => {
  let x = TestList;
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
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
    <div className="print-container">
      <div ref={ref}>dfdsfdsfs</div>
    </div>
  );
});

export default Test;
