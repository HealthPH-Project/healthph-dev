import { toJpeg, toPng, toSvg } from "dom-to-image-more";
import { forwardRef, useEffect, useState } from "react";

const PrintTrendsMap = forwardRef(({ mapImage, dateTable }, ref) => {
  const formatDataLength = (value, minDigit) => {
    return value.length > minDigit
      ? value.toString().padStart(minDigit, "0").slice(0, minDigit)
      : value.toString().padStart(minDigit, "0");
  };
  const [image, setImage] = useState(null);

  function filter(node) {
    // if (node.class.contains)
    return node.tagName !== "i";
  }
  //   useEffect(() => {
  //     const convertMapToPng = async () => {
  //       //   var node = document.getElementById("trends-map-container");
  //       var node = document.getElementsByClassName("leaflet-container")[0];

  //       try {
  //         const dataUrl = await toPng(node, {
  //           height: node.clientHeight,
  //           width: node.clientWidth,
  //           quality: 0.95,
  //           filter: filter,
  //         });

  //         setImage(dataUrl);
  //       } catch (error) {
  //         console.error("Error converting component to PNG:", error);
  //       }
  //     };

  //     convertMapToPng();
  //   }, []);

  return (
    <div className="print-component">
      <div className="print-container" ref={ref}>
        <div className="page">
          <div className="page-header mb-[36px]">
            <p>Trends Map</p>
            <p>HealthPH</p>
          </div>
          <div className="page-content">
            <div className="content-header">
              <div className="flex items-center">
                <p>Trends Map</p>
              </div>
              <p>As of {dateTable}</p>
            </div>
            <div className="h-[900px] w-full">
              <img
                src={mapImage}
                className="w-full h-full object-contain"
                alt=""
              />
            </div>
          </div>
          <div className="page-footer mt-[36px]">
            <p></p>
            <p>Page {formatDataLength(0 + 1, 2)} </p>
          </div>
        </div>
      </div>
    </div>
  );
});
export default PrintTrendsMap;
