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

import { useUploadFileMutation } from "./features/api/datasetsSlice";

const Test = () => {
  let x = TestList;
  const [code, setCode] = useState("");
  const [splitCode, setSplitCode] = useState([]);
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0);

  const handleChangeCode = (e) => {
    // if (code.length >= 6) return;

    const re = /^[0-9\b]+$/;

    // if value is not blank, then test the regex

    if (e.target.value === "" || re.test(e.target.value)) {
      if (e.target.value.length <= 6) setCode(e.target.value);
    }
  };

  useEffect(() => {
    setSplitCode(code.split(""));
  }, [code]);

  return (
    <>
      <div className="test-layout">
        <div>
          <input
            type="text"
            className="input input-md"
            value={code}
            onChange={handleChangeCode}
          />

          <div className="grid grid-cols-6">
            <div className={"border h-24 flex items-center justify-center"}>
              {splitCode[0] ?? ""}
            </div>
            <div className="border h-24 flex items-center justify-center">
              {splitCode[1] ?? ""}
            </div>
            <div className="border h-24 flex items-center justify-center">
              {splitCode[2] ?? ""}
            </div>
            <div className="border h-24 flex items-center justify-center">
              {splitCode[3] ?? ""}
            </div>
            <div className="border h-24 flex items-center justify-center">
              {splitCode[4] ?? ""}
            </div>
            <div className="border h-24 flex items-center justify-center">
              {splitCode[5] ?? ""}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Test;

const DeviceInfo = () => {
  const [matchMed, setMatchMed] = useState(null);

  useEffect(() => {
    const y = window.matchMedia("(display-mode: standalone)");
    // console.log(y.matches);
    setMatchMed(y.matches ? "True" : "False");
  }, []);

  return (
    <div>
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
  );
};
