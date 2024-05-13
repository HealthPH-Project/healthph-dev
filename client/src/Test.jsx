import { forwardRef, useEffect, useRef } from "react";
import TestList from "./test.json";
import React, { useState, useCallback, useMemo } from "react";
import ScrollToTop from "./components/ScrollToTop";

const Test = () => {
  let x = TestList;

  return (
    <>
      <div className="test-layout">
        <h1 className="web-d-h1">sdfdsfds </h1>
        <h1 className="web-d-h1">sdfdsfds </h1>
        <h1 className="web-d-h1">sdfdsfds </h1>
        <h1 className="web-d-h1">sdfdsfds </h1>
        <h1 className="web-d-h1">sdfdsfds </h1>
        <h1 className="web-d-h1">sdfdsfds </h1>
        <h1 className="web-d-h1">sdfdsfds </h1>
        <h1 className="web-d-h1">sdfdsfds </h1>
        <h1 className="web-d-h1">sdfdsfds </h1>
        <h1 className="web-d-h1">sdfdsfds </h1>
        <h1 className="web-d-h1">sdfdsfds </h1>
        <h1 className="web-d-h1">sdfdsfds </h1>
        <h1 className="web-d-h1">sdfdsfds </h1>
        <h1 className="web-d-h1">sdfdsfds </h1>
        <ScrollToTop />
      </div>
    </>
  );
};

export default Test;
