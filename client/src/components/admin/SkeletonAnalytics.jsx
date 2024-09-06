import { NavLink } from "react-router-dom";
import Icon from "../Icon";

const SkeletonAnalytics = () => {
  return (
    <>
      <div className="admin-wrapper flex flex-col h-full">
        <div className="header">
          <div className="breadcrumbs-wrapper">
            <div className="breadcrumb-item">
              <NavLink to="/dashboard">Analytics</NavLink>
              <Icon
                iconName="ChevronRight"
                height="16px"
                width="16px"
                fill="#A1ACB8"
                className="icon"
              />
            </div>
          </div>
        </div>
        <div className="skeleton h-auto w-full">
          <div className=" flex flex-col sm:flex-row justify-between items-start sm:items-center w-full mb-[20px]">
            <div className="w-[150px] h-[36px]"></div>
            <div className="flex h-[36px] mt-[20px] sm:mt-0">
              <div className="w-[150px]  me-4"></div>
              <div className="w-[150px]"></div>
            </div>
          </div>
          <div className="skeleton-cards mb-[32px]">
            {Array.from({ length: 5 }).map((v, i) => {
              return (
                <div className="item" key={i}>
                  <div className="h-[20px] w-[50%]"></div>
                  <div className="h-[20px] w-[35%] my-[4px]"></div>
                  <div className="h-[20px] w-[70%]"></div>
                </div>
              );
            })}
          </div>
          <div className=" flex flex-col sm:flex-row justify-between items-start sm:items-center w-full mb-[20px]">
            <div className="w-[150px] h-[36px]"></div>
            <div className="flex h-[36px] mt-[20px] sm:mt-0">
              <div className="w-[150px]  me-4"></div>
              <div className="w-[150px]"></div>
            </div>
          </div>
          <div className="skeleton-reports mb-[20px]">
            {Array.from({ length: 2 }).map((v, i) => {
              return (
                <div className="item" key={i}>
                  <div className="w-full h-full"></div>
                  <div className="icon-wrapper">
                    <Icon
                      iconName="Analytics"
                      height="240px"
                      width="240px"
                      fill="#FFF"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
export default SkeletonAnalytics;
