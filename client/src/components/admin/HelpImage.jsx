import AdminNavigation from "../../assets/images/help/admin-navigation.png";
import AdminAnalytics from "../../assets/images/help/admin-analytics.png";
import AdminTrendsMap from "../../assets/images/help/admin-trends-map.png";
import AdminMap from "../../assets/images/help/admin-map.png";
import AdminMap2 from "../../assets/images/help/admin-map-2.png";
import AdminListView from "../../assets/images/help/admin-list-view.png";
import AdminUpload from "../../assets/images/help/admin-upload.png";
import AdminUpload2 from "../../assets/images/help/admin-upload-2.png";
import AdminUserManagement from "../../assets/images/help/admin-user-management.png";
import AdminAddUser from "../../assets/images/help/admin-add-user.png";
import AdminActivityLogs from "../../assets/images/help/admin-activity-logs.png";
import AdminSettings from "../../assets/images/help/admin-settings.png";

import AdminNavigationMd from "../../assets/images/help/admin-navigation-md.png";
import AdminAnalyticsMd from "../../assets/images/help/admin-analytics-md.png";
import AdminTrendsMapMd from "../../assets/images/help/admin-trends-map-md.png";
import AdminMapMd from "../../assets/images/help/admin-map-md.png";
import AdminMap2Md from "../../assets/images/help/admin-map-2-md.png";
import AdminListViewMd from "../../assets/images/help/admin-list-view-md.png";
import AdminUploadMd from "../../assets/images/help/admin-upload-md.png";
import AdminUpload2Md from "../../assets/images/help/admin-upload-2-md.png";
import AdminUserManagementMd from "../../assets/images/help/admin-user-management-md.png";
import AdminAddUserMd from "../../assets/images/help/admin-add-user-md.png";
import AdminActivityLogsMd from "../../assets/images/help/admin-activity-logs-md.png";
import AdminSettingsMd from "../../assets/images/help/admin-settings-md.png";

import AdminNavigationSm from "../../assets/images/help/admin-navigation-sm.png";
import AdminAnalyticsSm from "../../assets/images/help/admin-analytics-sm.png";
import AdminTrendsMapSm from "../../assets/images/help/admin-trends-map-sm.png";
import AdminMapSm from "../../assets/images/help/admin-map-sm.png";
import AdminMap2Sm from "../../assets/images/help/admin-map-2-sm.png";
import AdminListViewSm from "../../assets/images/help/admin-list-view-sm.png";
import AdminUploadSm from "../../assets/images/help/admin-upload-sm.png";
import AdminUpload2Sm from "../../assets/images/help/admin-upload-2-sm.png";
import AdminUserManagementSm from "../../assets/images/help/admin-user-management-sm.png";
import AdminAddUserSm from "../../assets/images/help/admin-add-user-sm.png";
import AdminActivityLogsSm from "../../assets/images/help/admin-activity-logs-sm.png";
import AdminSettingsSm from "../../assets/images/help/admin-settings-sm.png";

import UserNavigation from "../../assets/images/help/user-navigation.png";
import UserAnalytics from "../../assets/images/help/user-analytics.png";
import UserTrendsMap from "../../assets/images/help/user-trends-map.png";
import UserMap from "../../assets/images/help/user-map.png";
import UserMap2 from "../../assets/images/help/user-map-2.png";
import UserListView from "../../assets/images/help/user-list-view.png";
import UserSettings from "../../assets/images/help/user-settings.png";

import UserNavigationMd from "../../assets/images/help/user-navigation-md.png";
import UserAnalyticsMd from "../../assets/images/help/user-analytics-md.png";
import UserTrendsMapMd from "../../assets/images/help/user-trends-map-md.png";
import UserMapMd from "../../assets/images/help/user-map-md.png";
import UserMap2Md from "../../assets/images/help/user-map-2-md.png";
import UserListViewMd from "../../assets/images/help/user-list-view-md.png";
import UserSettingsMd from "../../assets/images/help/user-settings-md.png";

import UserNavigationSm from "../../assets/images/help/user-navigation-sm.png";
import UserAnalyticsSm from "../../assets/images/help/user-analytics-sm.png";
import UserTrendsMapSm from "../../assets/images/help/user-trends-map-sm.png";
import UserMapSm from "../../assets/images/help/user-map-sm.png";
import UserMap2Sm from "../../assets/images/help/user-map-2-sm.png";
import UserListViewSm from "../../assets/images/help/user-list-view-sm.png";
import UserSettingsSm from "../../assets/images/help/user-settings-sm.png";

import useDeviceDetect from "../../hooks/useDeviceDetect";
import { useEffect, useState } from "react";
import Icon from "../Icon";

const HelpImage = ({ image }) => {
  const { isPWA } = useDeviceDetect();

  const [size, setSize] = useState("base");

  const [modalActive, setModalActive] = useState(false);

  useEffect(() => {
    if (isPWA) {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 360) {
        setSize("sm");
      } else if (screenWidth <= 768) {
        setSize("md");
      } else {
        setSize("base");
      }
    }
  }, []);

  const imageList = {
    "admin-navigation": AdminNavigation,
    "admin-analytics": AdminAnalytics,
    "admin-trends-map": AdminTrendsMap,
    "admin-map": AdminMap,
    "admin-map-2": AdminMap2,
    "admin-list-view": AdminListView,
    "admin-upload-dataset": AdminUpload,
    "admin-upload-dataset-2": AdminUpload2,
    "admin-user-management": AdminUserManagement,
    "admin-add-user": AdminAddUser,
    "admin-activity-logs": AdminActivityLogs,
    "admin-settings": AdminSettings,
    "user-navigation": UserNavigation,
    "user-analytics": UserAnalytics,
    "user-trends-map": UserTrendsMap,
    "user-map": UserMap,
    "user-map-2": UserMap2,
    "user-list-view": UserListView,
    "user-settings": UserSettings,
  };
  const imageListMd = {
    "admin-navigation": AdminNavigationMd,
    "admin-analytics": AdminAnalyticsMd,
    "admin-trends-map": AdminTrendsMapMd,
    "admin-map": AdminMapMd,
    "admin-map-2": AdminMap2Md,
    "admin-list-view": AdminListViewMd,
    "admin-upload-dataset": AdminUploadMd,
    "admin-upload-dataset-2": AdminUpload2Md,
    "admin-user-management": AdminUserManagementMd,
    "admin-add-user": AdminAddUserMd,
    "admin-activity-logs": AdminActivityLogsMd,
    "admin-settings": AdminSettingsMd,
    "user-navigation": UserNavigationMd,
    "user-analytics": UserAnalyticsMd,
    "user-trends-map": UserTrendsMapMd,
    "user-map": UserMapMd,
    "user-map-2": UserMap2Md,
    "user-list-view": UserListViewMd,
    "user-settings": UserSettingsMd,
  };

  const imageListSm = {
    "admin-navigation": AdminNavigationSm,
    "admin-analytics": AdminAnalyticsSm,
    "admin-trends-map": AdminTrendsMapSm,
    "admin-map": AdminMapSm,
    "admin-map-2": AdminMap2Sm,
    "admin-list-view": AdminListViewSm,
    "admin-upload-dataset": AdminUploadSm,
    "admin-upload-dataset-2": AdminUpload2Sm,
    "admin-user-management": AdminUserManagementSm,
    "admin-add-user": AdminAddUserSm,
    "admin-activity-logs": AdminActivityLogsSm,
    "admin-settings": AdminSettingsSm,
    "user-navigation": UserNavigationSm,
    "user-analytics": UserAnalyticsSm,
    "user-trends-map": UserTrendsMapSm,
    "user-map": UserMapSm,
    "user-map-2": UserMap2Sm,
    "user-list-view": UserListViewSm,
    "user-settings": UserSettingsSm,
  };

  return (
    <>
      <div className="image-wrapper" onClick={() => setModalActive(true)}>
        {image && size == "base" && <img src={imageList[image]} alt={image} />}
        {image && size == "md" && <img src={imageListMd[image]} alt={image} />}
        {image && size == "sm" && <img src={imageListSm[image]} alt={image} />}
      </div>

      {modalActive && (
        <div className="help-image-modal">
          <div className="modal-backdrop"></div>
          <div className="modal-close" onClick={() => setModalActive(false)}>
            <Icon
              iconName="Close"
              height="36px"
              width="36px"
              className="icon"
              stroke="#FFF"
            />
          </div>
          <div className="modal-image">
            {image && size == "base" && (
              <img src={imageList[image]} alt={image} />
            )}
            {image && size == "md" && (
              <img src={imageListMd[image]} alt={image} />
            )}
            {image && size == "sm" && (
              <img src={imageListSm[image]} alt={image} />
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default HelpImage;
