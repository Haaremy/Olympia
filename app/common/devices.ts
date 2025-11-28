// /common/device.ts
import { Capacitor } from "@capacitor/core";

/**
 * Browser-safe userAgent
 */
const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";

/**
 * Native vs Web
 */
export const isNativeApp = () => Capacitor.isNativePlatform();
export const isWeb = () => !Capacitor.isNativePlatform();

/**
 * OS detection
 */
export const isIOS = () => /iPad|iPhone|iPod/.test(ua) || isIpadOS() || Capacitor.getPlatform()=="ios";
export const isAndroid = () => /Android/.test(ua) || Capacitor.getPlatform() == "android";
export const isMacOS = () => /Macintosh/.test(ua) && !isIOS();
export const isWindows = () => /Windows/.test(ua);
export const isLinux = () => /Linux/.test(ua);

/**
 * iOS device types
 */
export const isIPhone = () => isIOS() && /iPhone/.test(ua);
export const isIPod = () => isIOS() && /iPod/.test(ua);
export const isIpadOS = () =>
  typeof navigator !== "undefined" &&
  navigator.platform === "MacIntel" &&
  typeof navigator.maxTouchPoints === "number" &&
  navigator.maxTouchPoints > 1;
export const isIPad = () => isIOS() && (isIpadOS() || /iPad/.test(ua));

/**
 * iPhone notch detection (X → 16 Pro Max)
 */
export const isIPhoneWithNotch = () => {
  if (!isIPhone()) return false;
  if (typeof window === "undefined") return false;

  const notchHeights = [812, 844, 896, 926, 932, 962, 1024, 1109, 1179];
  const h = window.screen.height;
  const w = window.screen.width;

  return notchHeights.includes(h) || notchHeights.includes(w);
};

/**
 * Devices with Dynamic Island (iPhone 14 Pro / 15 Pro / 16 Pro etc.)
 */
export const isDynamicIsland = () => {
  if (!isIPhone()) return false;
  if (!isIPhoneWithNotch()) return false;

  const dynamicHeights = [852, 932, 1024, 1179, 1206];
  const h = window.screen.height;
  const w = window.screen.width;

  return dynamicHeights.includes(h) || dynamicHeights.includes(w);
};

/**
 * WebView detection
 */
export const isWebView = () => {
  if (isNativeApp()) return false;
  return /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(ua);
};

/**
 * Tablets & Desktops
 */
export const isTablet = () => isIPad() || (/Android/.test(ua) && !/Mobile/.test(ua));
export const isDesktop = () => !isIOS() && !isAndroid();

/**
 * PWA detection
 */
export const isPWA = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches;
};

/**
 * iPhone Simulator detection
 */
export const isIPhoneSimulator = () => {
  if (typeof navigator === "undefined") return false;

  const isMacIntel = navigator.platform === "MacIntel";
  const hasTouch = navigator.maxTouchPoints > 1;

  return isMacIntel && hasTouch && isIPhone();
};

/**
 * Native iOS Simulator detection
 */
export const isNativeIOSSimulator = () => isNativeApp() && isIPhoneSimulator();

/**
 * Combined info object
 */
export const deviceInfo = () => ({
  native: isNativeApp(),
  web: isWeb(),
  ios: isIOS(),
  android: isAndroid(),
  mac: isMacOS(),
  windows: isWindows(),
  linux: isLinux(),
  iphone: isIPhone(),
  ipod: isIPod(),
  ipad: isIPad(),
  ipados: isIpadOS(),
  iphoneNotch: isIPhoneWithNotch(),
  dynamicIsland: isDynamicIsland(),
  webview: isWebView(),
  tablet: isTablet(),
  desktop: isDesktop(),
  pwa: isPWA(),
  simulator: isIPhoneSimulator(),
  nativeSimulator: isNativeIOSSimulator(),
});
