import { useCallback, useEffect, useMemo, useState } from "react";
import MultiSelect from "../../components/MultiSelect";
import useSwipe from "../../hooks/useSwipe";
import CustomSelect from "../../components/CustomSelect";
import Regions from "../../assets/data/regions.json";
import RegionsCoordinates from "../../assets/data/regions_coordinates.json";
import { format, subDays } from "date-fns";
import Icon from "../../components/Icon";
import SidebarDataItem from "../../components/admin/SidebarDataItem";
import {
  AttributionControl,
  MapContainer,
  Polygon,
  TileLayer,
} from "react-leaflet";
import Map from "../../components/admin/Map";

const TrendsMap = () => {
  const [sidebarActive, setSidebarActive] = useState(false);

  const [sideAnimate, setSideAnimate] = useState("");

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
    region: Regions.regions,
    dateRange: 7,
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

  return (
    <div className="trends-wrapper">
      <div className={`sidebar ${sidebarActive ? "" : "close-sidebar"}`}>
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
            options={Regions.regions}
            placeHolder="Select Region/s"
            onChange={(e) => handleChangeFilter("region", e)}
            selectAllLabel="All Regions"
            selectAll={true}
            additionalClassname="w-full mb-[20px]"
            menuPlacement="top"
            menuClassname={`${
              sidebarActive ? "menu-bottom" : "menu-top"
            } md:menu-bottom`}
          />
          <CustomSelect
            options={getDateRangeOptions()}
            placeholder="Select Date Range"
            size="input-select-md"
            value={filters.dateRange}
            handleChange={(e) => handleChangeFilter("dateRange", e)}
            additionalClasses="w-full"
          />
        </div>

        {/* TABS */}
        <div className="sidebar-tabs">
          <div className="tabs-wrapper">
            <div className="tab-item active">
              <span className="label">All</span>
              <span className="count">000</span>
            </div>
            <div className="tab-item ">
              <span className="label">Tubercolosis</span>
              <span className="count">000</span>
            </div>
            <div className="tab-item ">
              <span className="label">Pneumonia</span>
              <span className="count">000</span>
            </div>
            <div className="tab-item ">
              <span className="label">COVID</span>
              <span className="count">000</span>
            </div>
            <div className="tab-item ">
              <span className="label">AURI</span>
              <span className="count">000</span>
            </div>
          </div>
        </div>

        {/* DATA / TRENDS */}
        <div className="sidebar-data">
          <SidebarDataItem
            headerLabel="Region III"
            data={[
              {
                symptom: "Tubercolosis",
                date: "Jan 1, 2024",
                collected: 999,
              },
              {
                symptom: "Pnuemonia",
                date: "Jan 1, 2024",
                collected: 999,
              },
              {
                symptom: "COVID",
                date: "Jan 1, 2024",
                collected: 999,
              },
              {
                symptom: "AURI",
                date: "Jan 1, 2024",
                collected: 999,
              },
            ]}
          />
          <SidebarDataItem
            headerLabel="Region VI"
            data={[
              {
                symptom: "Tubercolosis",
                date: "Jan 1, 2024",
                collected: 999,
              },
              {
                symptom: "Pnuemonia",
                date: "Jan 1, 2024",
                collected: 999,
              },
              {
                symptom: "COVID",
                date: "Jan 1, 2024",
                collected: 999,
              },
              {
                symptom: "AURI",
                date: "Jan 1, 2024",
                collected: 999,
              },
            ]}
          />
          <SidebarDataItem
            headerLabel="Region IX"
            data={[
              {
                symptom: "Tubercolosis",
                date: "Jan 1, 2024",
                collected: 999,
              },
              {
                symptom: "Pnuemonia",
                date: "Jan 1, 2024",
                collected: 999,
              },
              {
                symptom: "COVID",
                date: "Jan 1, 2024",
                collected: 999,
              },
              {
                symptom: "AURI",
                date: "Jan 1, 2024",
                collected: 999,
              },
            ]}
          />
          <SidebarDataItem
            headerLabel="Region V"
            data={[
              {
                symptom: "Tubercolosis",
                date: "Jan 1, 2024",
                collected: 999,
              },
              {
                symptom: "Pnuemonia",
                date: "Jan 1, 2024",
                collected: 999,
              },
              {
                symptom: "COVID",
                date: "Jan 1, 2024",
                collected: 999,
              },
              {
                symptom: "AURI",
                date: "Jan 1, 2024",
                collected: 999,
              },
            ]}
          />
        </div>
      </div>

      {/* BACKGROUND BLUR */}
      <div
        className={`sidebar-back ${sideAnimate}`}
        onAnimationEnd={handleAnimationEnd}
        onClick={handleOpenSidebar}
      ></div>

      <Map filters={filters} />
    </div>
  );
};
export default TrendsMap;
