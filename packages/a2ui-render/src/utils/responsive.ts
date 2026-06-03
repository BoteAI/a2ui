import { useState, useEffect } from 'react';

// 响应式断点定义
export const BREAKPOINTS = {
  mobile: 768, // 移动端
  tablet: 1024, // 平板
  desktop: 1920, // 桌面端
} as const;

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

// 判断是否为移动端设备（基于 userAgent）
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent
  );
};

// 获取当前设备类型（基于窗口宽度）
export const getDeviceType = (width?: number): DeviceType => {
  const windowWidth = width ?? (typeof window !== 'undefined' ? window.innerWidth : 1920);
  
  if (windowWidth <= BREAKPOINTS.mobile) {
    return 'mobile';
  }
  if (windowWidth <= BREAKPOINTS.tablet) {
    return 'tablet';
  }
  return 'desktop';
};

// 判断是否为移动端（基于窗口宽度）
export const isMobile = (width?: number): boolean => {
  return getDeviceType(width) === 'mobile';
};

// 判断是否为平板
export const isTablet = (width?: number): boolean => {
  return getDeviceType(width) === 'tablet';
};

// 判断是否为桌面端
export const isDesktop = (width?: number): boolean => {
  return getDeviceType(width) === 'desktop';
};

// React Hook: 监听窗口大小变化
export const useResponsive = () => {
  const [deviceType, setDeviceType] = useState<DeviceType>(() => getDeviceType());
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1920
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setDeviceType(getDeviceType(width));
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 初始化

    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    deviceType,
    windowWidth,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
  };
};

// 获取响应式样式
export const getResponsiveStyle = (
  mobileStyle?: React.CSSProperties,
  tabletStyle?: React.CSSProperties,
  desktopStyle?: React.CSSProperties,
  deviceType?: DeviceType
): React.CSSProperties => {
  const currentDevice = deviceType || getDeviceType();
  
  switch (currentDevice) {
    case 'mobile':
      return { ...desktopStyle, ...tabletStyle, ...mobileStyle };
    case 'tablet':
      return { ...desktopStyle, ...tabletStyle };
    case 'desktop':
    default:
      return desktopStyle || {};
  }
};

// 获取响应式间距
export const getResponsiveSpacing = (
  mobile: number | string = 8,
  tablet: number | string = 16,
  desktop: number | string = 24,
  deviceType?: DeviceType
): number | string => {
  const currentDevice = deviceType || getDeviceType();
  
  switch (currentDevice) {
    case 'mobile':
      return mobile;
    case 'tablet':
      return tablet;
    case 'desktop':
    default:
      return desktop;
  }
};

// 获取响应式字体大小
export const getResponsiveFontSize = (
  mobile: number = 14,
  tablet: number = 16,
  desktop: number = 18,
  deviceType?: DeviceType
): number => {
  const currentDevice = deviceType || getDeviceType();
  
  switch (currentDevice) {
    case 'mobile':
      return mobile;
    case 'tablet':
      return tablet;
    case 'desktop':
    default:
      return desktop;
  }
};
