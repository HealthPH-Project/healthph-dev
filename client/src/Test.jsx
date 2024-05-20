import { forwardRef, useEffect, useRef } from "react";
import TestList from "./test.json";
import React, { useState, useCallback, useMemo } from "react";
import ScrollToTop from "./components/ScrollToTop";

import {
  deviceType,
  getUA,
  engineName,
  engineVersion,
  mobileModel,
  mobileVendor,
  osVersion,
  osName,
  fullBrowserVersion,
  browserVersion,
  browserName,
} from "react-device-detect";

const Test = () => {
  let x = TestList;

  const [matchMed, setMatchMed] = useState(null);

  useEffect(() => {
    const y = window.matchMedia("(display-mode: standalone)");
    console.log(y.matches);
    setMatchMed(y.matches ? "True" : "False");
  }, []);

  return (
    <>
      <div className="test-layout">
        <p>Device Type: {deviceType}</p>
        <p>User Agent: {getUA}</p>
        <p>Engine Name: {engineName}</p>
        <p>EngineVersion: {engineVersion}</p>
        <p>Mobile Model: {mobileModel}</p>
        <p>Mobile Vendor: {mobileVendor}</p>
        <p>OS Version: {osVersion}</p>
        <p>OS Name: {osName}</p>
        <p>Browser Version: {browserVersion}</p>
        <p>Browser Name: {browserName}</p>
        <p>Full Browser Version: {fullBrowserVersion}</p>
        <p>Display-Mode : Standalone : {matchMed}</p>
      </div>
    </>
  );
};

export default Test;
