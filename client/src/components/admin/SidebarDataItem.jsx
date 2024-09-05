import { useState } from "react";
import Icon from "../Icon";

const ContentBodyItem = ({ disease_name, date, count, keyword }) => {
  const getDiseaseName = () => {
    switch (disease_name) {
      case "tubercolosis":
        return "Tubercolosis";
      case "pneumonia":
        return "Pneumonia";
      case "covid":
        return "COVID";
      case "auri":
        return "AURI";
    }
  };

  return (
    <div className="content-body-item">
      <div>
        <p className="prod-p3 font-medium text-gray-700 mb-[5px]">{keyword}</p>
        {/* <p className="prod-p3 font-medium text-gray-300">{keyword}</p> */}
      </div>
      <div>
        <p className="prod-p3 font-medium text-gray-700">{count}</p>
      </div>
    </div>
  );
};

const SidebarDataItem = ({ headerLabel, data, currentDisease }) => {
  const regionsName = {
    NCR: "National Capital Region",
    I: "Region I",
    II: "Region II",
    III: "Region III",
    V: "Region V",
    VI: "Region VI",
    VII: "Region VII",
    VIII: "Region VIII",
    IX: "Region IX",
    X: "Region X",
    XI: "Region XI",
    XII: "Region XII",
    XIII: "Region XIII",
    BARMM: "Bangsamoro Autonomous Region in Muslim Mindanao",
    CAR: "Cordillera Administrative Region",
    IVA: "CALABARZON",
    IVB: "MIMAROPA",
  };

  const diseaseCode = {
    tuberculosis: "TB",
    pneumonia: "PN",
    covid: "COVID",
    auri: "AURI",
  };
  const [itemActive, setItemActive] = useState(false);
  return (
    <div className={`sidebar-data-item ${itemActive ? "active" : ""}`}>
      <div
        className="sidebar-data-header"
        onClick={() => setItemActive(!itemActive)}
      >
        <span>{regionsName[headerLabel]}</span>
        <Icon
          iconName="ChevronDown"
          height="20px"
          width="20px"
          fill="#465360"
          className="icon"
        />
      </div>
      {itemActive && (
        <div className="sidebar-data-item-content">
          <div className="content-header">
            <div>
              <span>SUSPECTED</span>
              <div className="column-tooltip">
                <Icon
                  iconName="Information"
                  height="16px"
                  width="16px"
                  fill="#8693A0"
                />
                <div className="tooltip">Sample Tooltip</div>
              </div>
            </div>
            <div>
              <span>DATA COLLECTED</span>
              <div className="column-tooltip">
                <Icon
                  iconName="Information"
                  height="16px"
                  width="16px"
                  fill="#8693A0"
                />
                <div className="tooltip">Sample Tooltip</div>
              </div>
            </div>
          </div>
          <div className="content-body">
            {data.map((v, i) => {
              if (
                currentDisease == "all" ||
                v.annotation.includes(diseaseCode[currentDisease])
              )
                return <ContentBodyItem key={i} {...v} keyword={v.key} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
};
export default SidebarDataItem;
