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

export default () => {
  return {
    // Device Type : mobile, tablet, or desktop
    deviceType: deviceType,
    // Example: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36
    userAgent: getUA,
    // Browser Engines: Blink (Google), WebKit (Apple), Gecko (Mozilla), etc.
    engineName: engineName,
    //
    engineVersion: engineVersion,
    // Mobile Brand / Vendor: Samsung, iPhone, LG, etc.
    mobileVendor: mobileVendor,
    // Mobile Device Model
    mobileModel,
    mobileModel,
    // OS Name: Windows, Android, iOS
    osName: osName,
    //
    osVersion: osVersion,
    // Browser Name: Chrome, Firefox, Safari, Opera, Safari, etc.
    browserName: browserName,
    //
    browserVersion,
    browserVersion,
    //
    fullBrowserVersion: fullBrowserVersion,
    // Checks if web app is being viewed as PWA (Progressive Web App)
    isPWA: window.matchMedia("(display-mode: standalone)").matches,
  };
};
