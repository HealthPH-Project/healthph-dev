import { useState } from "react";
import Icon from "../Icon";

const ContentBodyItem = ({ disease_name, date, count }) => {
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
        <p className="prod-p3 font-medium text-gray-700 mb-[5px]">
          {getDiseaseName()}
        </p>
        <p className="prod-p3 font-medium text-gray-300">Jan 1, 2024</p>
      </div>
      <div>
        <p className="prod-p3 font-medium text-gray-700">{count}</p>
      </div>
    </div>
  );
};

const SidebarDataItem = ({ headerLabel, data }) => {
  const [itemActive, setItemActive] = useState(false);
  return (
    <div className={`sidebar-data-item ${itemActive ? "active" : ""}`}>
      <div
        className="sidebar-data-header"
        onClick={() => setItemActive(!itemActive)}
      >
        <span>{headerLabel}</span>
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
              return <ContentBodyItem key={i} {...v} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
};
export default SidebarDataItem;
