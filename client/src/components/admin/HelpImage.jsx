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

import UserNavigation from "../../assets/images/help/user-navigation.png";
import UserAnalytics from "../../assets/images/help/user-analytics.png";
import UserTrendsMap from "../../assets/images/help/user-trends-map.png";
import UserMap from "../../assets/images/help/user-map.png";
import UserMap2 from "../../assets/images/help/user-map-2.png";
import UserListView from "../../assets/images/help/user-list-view.png";
import UserSettings from "../../assets/images/help/user-settings.png";

const HelpImage = ({ image }) => {
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

  return (
    <div className="image-wrapper">
      {image && <img src={imageList[image]} alt={image} />}
    </div>
  );
};
export default HelpImage;
