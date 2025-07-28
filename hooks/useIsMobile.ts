import { useEffect, useState } from "react";

/**
 * Custom hook to detect if the current device is a mobile device.
 *
 * Uses window.innerWidth and user agent as a fallback for SSR.
 * Returns true if the device is likely a mobile device.
 *
 * @returns {boolean} isMobile - true if mobile, false if desktop
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check window width
    const checkMobile = () => {
      if (typeof window === "undefined") return;
      const width = window.innerWidth;
      // You can adjust the threshold as needed
      if (width <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}
