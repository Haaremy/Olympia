interface NavigatorUAData {
  platform: string;
  model?: string;
  getHighEntropyValues(hints: string[]): Promise<NavigatorUAData>;
}

interface NavigatorWithUAData extends Navigator {
  userAgentData?: NavigatorUAData;
}

export function detectPlatform(): Promise<string> {
  const nav = navigator as NavigatorWithUAData;

  // 1. Modern API (Chromium)
  if (nav.userAgentData) {
    return nav.userAgentData
      .getHighEntropyValues(["platform", "model"])
      .then((ua) => {
        if (ua.platform && ua.platform.trim() !== "") {
          return normalizePlatform(ua.platform);
        }
        return parseUserAgent(navigator.userAgent);
      });
  }

  // 2. Fallback (Safari, Firefox, ältere Browser)
  return Promise.resolve(parseUserAgent(navigator.userAgent));
}

function normalizePlatform(platform: string): string {
  const p = platform.toLowerCase();
  if (p.includes("win")) return "Windows";
  if (p.includes("android")) return "Android";
  if (p.includes("ios")) return "iOS";
  if (p.includes("mac")) return "Mac";
  if (p.includes("linux")) return "Linux";
  return "Unknown";
}

function parseUserAgent(ua: string): string {
  const u = ua.toLowerCase();
  if (u.includes("windows")) return "Windows";
  if (u.includes("android")) return "Android";
  if (u.includes("iphone") || u.includes("ipad")) return "iOS";
  if (u.includes("mac os")) return "Mac";
  if (u.includes("linux")) return "Linux";
  return "Unknown";
}
