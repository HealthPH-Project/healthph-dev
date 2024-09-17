import { forwardRef, useEffect, useRef } from "react";
// import TestList from "./test.json";
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
import html2canvas from "html2canvas";
import MapScreenshot from "./components/admin/MapScreenshot";

const Test = () => {
  // let x = TestList;
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

  const [image, setImage] = useState(null);
  const [displayMap, setDisplayMap] = useState(false);
  const captureRef = useRef();
  useEffect(() => {
    // setDisplayMap(false);
  }, []);

  const handleClick = async () => {
    console.log("asas");
    // setDisplayMap(true);
    // setTimeout(() => {
    //   console.log("wait");
    // }, 5000);
    const canvas = await html2canvas(captureRef.current, { useCORS: true });
    // const canvas = await html2canvas(document.getElementById("sample"), {
    //   useCORS: true,
    // });

    var dataURL = canvas.toDataURL("image/png");
    setImage(dataURL);
    // Create an image element from the data URL
    // var img = new Image();
    // img.src = dataURL;
    // img.download = dataURL;
    // // Create a link element
    // var a = document.createElement("a");
    // a.innerHTML = "DOWNLOAD";
    // a.target = "_blank";
    // // Set the href of the link to the data URL of the image
    // a.href = img.src;
    // // Set the download attribute of the link
    // a.download = img.download;
    // // Append the link to the page
    // document.body.appendChild(a);
    // // Click the link to trigger the download
    // a.click();
  };

  return (
    <>
      <div className="test-layout  w-[1400px] h-[1700px]">
        <div className="fixed top-0 left-0 z-50">
          <button
            className="prod-btn-base prod-btn-primary"
            onClick={handleClick}
          >
            CLICK
          </button>
        </div>
        <div className="bg-success-300 w-[300px] h-[300px]">
          {/* <MapScreenshot filterRegions="all" /> */}
          <img src={image} className="h-full w-full object-contain" alt="" />
        </div>
        {/* <div
          id="sample"
          ref={captureRef}
          className={`${
            displayMap ? "" : "right-[100%]"
          } sample-wrapper w-[1400px] h-[1700px] bg-destructive-200 fixed top-0`}
        >
          <MapScreenshot filterRegions="all" />
        </div> */}

        <MapScreenshot
          filters={{
            region: [
              {
                label: "Region III",
                value: "III",
                order: 3,
              },
            ],
          }}
          ref={captureRef}
        />
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
