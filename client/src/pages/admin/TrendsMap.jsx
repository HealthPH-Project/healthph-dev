import { useEffect, useRef, useState } from "react";
import { format, subDays } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { updateInitialLogin } from "../../features/auth/authSlice";
import useSwipe from "../../hooks/useSwipe";

import Icon from "../../components/Icon";
import MultiSelect from "../../components/MultiSelect";
import CustomSelect from "../../components/CustomSelect";
import SidebarDataItem from "../../components/admin/SidebarDataItem";
import Map from "../../components/admin/Map";
import Modal from "../../components/admin/Modal";

import Dummy from "../../dummy.json";
import Regions from "../../assets/data/regions.json";
import RegionsCenter from "../../assets/data/regions_center.json";
import Sample from "../../assets/data/sample.json";
import DummyData from "../../assets/data/dummy_data_v3.json";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import PrintTrendsMap from "../../components/admin/PrintTrendsMap";
import MapScreenshot from "../../components/admin/MapScreenshot";
import html2canvas from "html2canvas";
import { useReactToPrint } from "react-to-print";
import {
  useFetchPointsByDiseaseQuery,
  useFetchPointsQuery,
} from "../../features/api/pointsSlice";
import EmptyState from "../../components/admin/EmptyState";
import { useCreateActivityLogMutation } from "../../features/api/activityLogsSlice";

const TrendsMap = () => {
  const user = useSelector((state) => state.auth.user);

  const auth = useSelector((state) => state.auth);

  const [log_activity] = useCreateActivityLogMutation();

  const { isPWA } = useDeviceDetect();

  const initialLogin = useSelector((state) => state.auth.initialLogin);

  const [sidebarActive, setSidebarActive] = useState(false);

  const [sideAnimate, setSideAnimate] = useState("");

  const {
    data: points,
    isLoading: isPointsLoading,
    error: isPointsError,
  } = useFetchPointsQuery();

  const {
    data: pointsDisease,
    isLoading: isPointsDiseaseLoading,
    error: isPointsDiseaseError,
  } = useFetchPointsByDiseaseQuery();

  const swipeHandlers = useSwipe({
    directions: ["up", "down"],
    onSwipedUp: () => {
      setSidebarActive(true);
      setSideAnimate("show");
    },
    onSwipedDown: () => {
      setSidebarActive(false);
      setSideAnimate("hide");
    },
  });

  const handleOpenSidebar = () => {
    setSidebarActive(!sidebarActive);
    setSideAnimate(!sidebarActive ? "show" : "hide");
  };

  const handleAnimationEnd = (e) => {
    if (e.target.classList.contains("hide")) {
      setSideAnimate("");
    }
  };

  const [filters, setFilters] = useState({
    region: Regions.regions.filter((r) =>
      user.accessible_regions.includes(r.value)
    ),
    dateRange: 7,
    disease: "all",
  });

  const getDateRangeOptions = () => {
    const dateNow = new Date();
    const values = [7, 14, 21, 28];
    const options = [];

    Array.from(values).forEach((v) => {
      options.push({
        label:
          `Past ${v} Days ` +
          format(subDays(dateNow, v), "(MMM d - ") +
          format(dateNow, "MMM d, yyyy)"),
        value: v,
      });
    });
    return options;
  };

  const handleChangeFilter = (key, value) => {
    setFilters((filters) => ({
      ...filters,
      [key]: value,
    }));
  };

  const getSidebarData = (disease) => {
    const diseases = Dummy["diseases"];
    let output = [];

    if (disease == "all") {
      output = diseases.reduce((acc, current) => {
        current.data.forEach((item) => {
          const existing = acc.find((obj) => obj.region === item.region);
          if (existing) {
            existing.data.push({
              disease_name: current.disease_name,
              count: item.count,
            });
          } else {
            acc.push({
              region: item.region,
              data: [{ disease_name: current.disease_name, count: item.count }],
            });
          }
        });
        return acc;
      }, []);
    } else {
      const specific_disease = diseases.find(
        (d) => d["disease_name"] == disease
      );
      output = specific_disease.data.map((item) => ({
        region: item.region,
        data: [
          { disease_name: specific_disease.disease_name, count: item.count },
        ],
      }));
    }

    output = output
      .sort((a, b) => {
        const indexA = Regions.regions.findIndex(
          (item) => item.value === a.region
        );
        const indexB = Regions.regions.findIndex(
          (item) => item.value === b.region
        );
        // Handle cases where a region might not be found in arr2
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      })
      .map((item) => ({
        ...item,
        region:
          item.region == "N/A" ? "Not Applicable" : `Region ${item.region}`,
      }));
    return output;
  };

  const [sidebarData, setSidebarData] = useState(getSidebarData("all"));

  const handleChangeDisease = (e) => {
    handleChangeFilter("disease", e.currentTarget.id.split("-")[1]);

    e.currentTarget.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });

    setSidebarData(getSidebarData(e.currentTarget.id.split("-")[1]));
  };

  const formatDataLength = (value, minDigit) => {
    return value.length > minDigit
      ? value.toString().padStart(minDigit, "0").slice(0, minDigit)
      : value.toString().padStart(minDigit, "0");
  };

  const getTotalCount = (disease) => {
    try {
      let count = 0;
      const diseases = Dummy["diseases"];
      if (disease == "all") {
        diseases.forEach((disease) => {
          disease["data"].forEach((d) => {
            if (filters.region.find((r) => r.value == d.region)) {
              count += d.count;
            }
          });
        });
      } else {
        const disease_data = diseases.find((d) => d["disease_name"] == disease);

        disease_data["data"].forEach((d) => {
          if (filters.region.find((r) => r.value == d.region)) {
            count += d.count;
          }
        });
      }
      return count;
    } catch {
      return 0;
    }
  };

  const [showDisclaimer, setShowDisclaimer] = useState(initialLogin);

  const dispatch = useDispatch();

  useEffect(() => {
    if (showDisclaimer == false) {
      dispatch(updateInitialLogin({ value: false }));
    }
  }, [showDisclaimer]);

  const getCenter = () => {
    if (user.user_type == "USER") {
      return RegionsCenter.find((c) => c.region == user.region).center;
    }
    return [13, 122];
  };

  const getAccessibleRegionsDisplay = () => {
    const accessible_regions = user.accessible_regions;

    let display = "";

    const regionNames = Regions.regions.reduce((acc, current) => {
      acc[current.value] = current.label;
      return acc;
    }, {});

    if (accessible_regions.length > 2) {
      display = `${regionNames[accessible_regions[0]]}, ${
        regionNames[accessible_regions[1]]
      } + ${accessible_regions.length - 2}`;
    } else {
      for (let i = 0; i < accessible_regions.length; i++) {
        display += regionNames[accessible_regions[i]];
        if (accessible_regions.length != i + 1) {
          display += ", ";
        }
      }
    }

    return accessible_regions.length == Regions.regions.length
      ? "All Regions"
      : display;
  };

  const printRef = useRef();

  const captureMapRef = useRef();

  const [mapImage, setMapImage] = useState("");

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "HealthPH - Trends Map",
    pageStyle:
      "@page { size: A4;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } img { border: none;} }",
    onAfterPrint: () => {
      document.getElementById("printWindow").remove();

      log_activity({
        user_id: auth.user.id,
        entry: "Generated Trends Map report",
        module: "Trends Map",
      });
    },
  });

  const handlePrintTrendsMap = async () => {
    const canvas = await html2canvas(captureMapRef.current, {
      useCORS: true,
      willReadFrequently: true,
    });
    canvas.getContext("2d", { willReadFrequently: true });
    var dataURL = canvas.toDataURL("image/png");

    setMapImage(dataURL);
    setTimeout(handlePrint, 500);
  };

  const getDiseaseCount = (disease) => {
    if (!isPointsLoading) {
      let counts = { TB: 0, PN: 0, AURI: 0, COVID: 0, total: 0 };

      if (filters.region.length == Regions.regions.length) {
        counts = pointsDisease["count"];
      } else {
        const regions = filters.region.map((v) => v.value);

        const regionsCount = pointsDisease["data"].filter((p) =>
          regions.includes(p.region)
        );

        let total = 0;

        regionsCount.forEach((rc) => {
          for (const key in rc["annotations_count"]) {
            if (counts.hasOwnProperty(key)) {
              counts[key] += rc["annotations_count"][key];
            }
          }

          rc["keywords"].forEach(({ count }) => {
            total += count;
          });
        });
        counts["total"] = total;
      }
      return counts[disease];
    }
    return "";
  };

  return (
    <>
      <div className="trends-wrapper">
        <div
          className={`sidebar ${sidebarActive ? "" : "close-sidebar"} ${
            ["ADMIN", "SUPERADMIN"].includes(user.user_type) && !isPWA
              ? ""
              : "sidebar-sm"
          }`}
        >
          <div
            className="sidebar-toggler"
            onClick={handleOpenSidebar}
            {...swipeHandlers}
          >
            <span></span>
          </div>

          {/* FILTERS */}
          <div className="filter-group">
            <MultiSelect
              options={Regions.regions.filter((r) =>
                user.accessible_regions.includes(r.value)
              )}
              defaultValue={
                user.user_type == "USER" ? user.accessible_regions : []
              }
              placeHolder="Select Region/s"
              onChange={(e) => handleChangeFilter("region", e)}
              selectAllLabel={getAccessibleRegionsDisplay()}
              selectAll={true}
              showSelectAll={user.user_type == "USER" ? false : true}
              additionalClassname="w-full"
              menuPlacement="top"
              menuClassname={`${
                sidebarActive ? "menu-bottom" : "menu-top"
              } md:menu-bottom`}
              // selectable={["ADMIN", "SUPERADMIN"].includes(user.user_type)}
            />
            {/* <CustomSelect
            options={getDateRangeOptions()}
            placeholder="Select Date Range"
            size="input-select-md"
            value={filters.dateRange}
            handleChange={(e) => handleChangeFilter("dateRange", e)}
            additionalClasses="w-full"
          /> */}

            {!isPWA && ["ADMIN", "SUPERADMIN"].includes(user.user_type) && (
              <Link
                to="/dashboard/trends-map/upload-dataset"
                className="prod-btn-base prod-btn-primary w-full flex items-center justify-center mt-[20px]"
              >
                <span>Upload Dataset</span>
                <Icon
                  iconName="Upload"
                  height="20px"
                  width="20px"
                  fill="#FFF"
                  className="ms-[8px]"
                />
              </Link>
            )}
            <button
              className="prod-btn-base prod-btn-secondary w-full flex items-center justify-center mt-[20px]"
              onClick={handlePrintTrendsMap}
            >
              <span>Print Trends Map</span>
              <Icon
                iconName="Printer"
                height="20px"
                width="20px"
                fill="#8693A0"
                className="ms-[8px]"
              />
            </button>
            <PrintTrendsMap
              ref={printRef}
              mapImage={mapImage}
              dateTable={format(new Date(), "MMMM dd, yyyy | hh:mm a")}
            />
          </div>

          {/* TABS */}
          <div className="sidebar-tabs">
            <div className="tabs-wrapper">
              <div
                className={`tab-item ${
                  filters.disease == "all" ? "active" : ""
                }`}
                id="disease-all"
                onClick={handleChangeDisease}
              >
                <span className="label">All</span>
                {pointsDisease && (
                  <span className="count">
                    {formatDataLength(getDiseaseCount("total"), 3)}
                  </span>
                )}
              </div>
              <div
                className={`tab-item ${
                  filters.disease == "tuberculosis" ? "active" : ""
                }`}
                id="disease-tuberculosis"
                onClick={handleChangeDisease}
              >
                <span className="label">PTB</span>
                {pointsDisease && (
                  <span className="count">
                    {formatDataLength(getDiseaseCount("TB"), 3)}
                  </span>
                )}
              </div>
              <div
                className={`tab-item ${
                  filters.disease == "pneumonia" ? "active" : ""
                }`}
                id="disease-pneumonia"
                onClick={handleChangeDisease}
              >
                <span className="label">Pneumonia</span>
                {pointsDisease && (
                  <span className="count">
                    {formatDataLength(getDiseaseCount("PN"), 3)}
                  </span>
                )}
              </div>
              <div
                className={`tab-item ${
                  filters.disease == "covid" ? "active" : ""
                }`}
                id="disease-covid"
                onClick={handleChangeDisease}
              >
                <span className="label">COVID</span>
                {pointsDisease && (
                  <span className="count">
                    {formatDataLength(getDiseaseCount("COVID"), 3)}
                  </span>
                )}
              </div>
              <div
                className={`tab-item ${
                  filters.disease == "auri" ? "active" : ""
                }`}
                id="disease-auri"
                onClick={handleChangeDisease}
              >
                <span className="label">AURI</span>
                {pointsDisease && (
                  <span className="count">
                    {formatDataLength(getDiseaseCount("AURI"), 3)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* DATA / TRENDS */}
          <div className="sidebar-data">
            {isPointsDiseaseLoading ? (
              <></>
            ) : pointsDisease["data"].length > 0 ? (
              pointsDisease["data"].map(
                ({ region, keywords, annotations }, i) => {
                  const diseaseCode = {
                    tuberculosis: "TB",
                    pneumonia: "PN",
                    covid: "COVID",
                    auri: "AURI",
                  };

                  const showByDisease =
                    filters.disease == "all" ||
                    annotations.includes(diseaseCode[filters.disease]);

                  if (
                    filters.region.find((r) => r.value == region) &&
                    showByDisease
                  )
                    return (
                      <SidebarDataItem
                        key={i}
                        headerLabel={region}
                        data={keywords}
                        currentDisease={filters.disease}
                      />
                    );
                }
              )
            ) : (
              <EmptyState
                iconName="Upload"
                heading="No datasets."
                content="Upload datasets in order to see markers on the map."
              >
                <Link
                  to="/dashboard/trends-map/upload-dataset"
                  className="prod-btn-base prod-btn-primary flex justify-center items-center"
                >
                  <span>Upload Dataset</span>
                </Link>
              </EmptyState>
            )}

            {/* {sidebarData.map(({ region, data }, i) => {
              if (filters.region.find((r) => r.label == region))
                return (
                  <SidebarDataItem key={i} headerLabel={region} data={data} />
                );
            })} */}
          </div>
        </div>

        {/* BACKGROUND BLUR */}
        <div
          className={`sidebar-back ${sideAnimate}`}
          onAnimationEnd={handleAnimationEnd}
          onClick={handleOpenSidebar}
        ></div>

        <Map
          filters={filters}
          data={DummyData}
          mapCenter={getCenter}
          points={points}
          isPointsLoading={isPointsLoading}
        />

        {showDisclaimer && (
          <Modal
            additionalClasses="z-[12]"
            onConfirm={() => {
              setShowDisclaimer(false);
            }}
            onConfirmLabel="Agree & Continue"
            heading="The data you'll see isn't diagnostic."
            content="The data are based on suspected symptoms collected from social media, not verified by healthcare professionals that tested these areas affected."
            color="primary"
          />
        )}
      </div>

      <MapScreenshot
        filters={filters}
        ref={captureMapRef}
        mapCenter={getCenter}
        points={points}
        isPointsLoading={isPointsLoading}
      />
    </>
  );
};
export default TrendsMap;
