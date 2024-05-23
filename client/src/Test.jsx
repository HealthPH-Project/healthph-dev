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

  const [matchMed, setMatchMed] = useState(null);

  useEffect(() => {
    const y = window.matchMedia("(display-mode: standalone)");
    // console.log(y.matches);
    setMatchMed(y.matches ? "True" : "False");
  }, []);

  const [file, setFile] = useState(null);

  const [uploadFile] = useUploadFileMutation();

  const handleChange = (e) => {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(file);

    const payload = new FormData();

    payload.append("file", file);

    const response = await uploadFile(payload);

    console.log(response);
  };
  return (
    <>
      <div className="test-layout">
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
          <form
            method="POST"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
          >
            <label>Upload</label>
            <input
              type="file"
              name="file"
              id="file"
              onChange={handleChange}
              accept=".csv"
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Test;
