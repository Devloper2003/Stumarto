import { useState, useEffect } from 'react';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  userAgent: string;
}

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
    orientation: 'landscape',
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
  });

  useEffect(() => {
    const detectDevice = () => {
      if (typeof window === 'undefined') return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const userAgent = window.navigator.userAgent;

      // Device detection logic
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) && width <= 768;
      const isTablet = (width > 768 && width <= 1024) || (/iPad|Android/i.test(userAgent) && width > 600);
      const isDesktop = width > 1024;
      const orientation = height > width ? 'portrait' : 'landscape';

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        width,
        height,
        orientation,
        userAgent,
      });
    };

    detectDevice();

    window.addEventListener('resize', detectDevice);
    window.addEventListener('orientationchange', detectDevice);

    return () => {
      window.removeEventListener('resize', detectDevice);
      window.removeEventListener('orientationchange', detectDevice);
    };
  }, []);

  return deviceInfo;
};
