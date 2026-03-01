import React from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

interface DeviceCompatibilityInfoProps {
  compact?: boolean;
}

const DeviceCompatibilityInfo: React.FC<DeviceCompatibilityInfoProps> = ({ compact = false }) => {
  const device = useDeviceDetection();

  if (compact) {
    return (
      <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest opacity-50 pointer-events-none">
        {device.isMobile ? '📱 Mobile' : device.isTablet ? '📱 Tablet' : '💻 Desktop'} • {device.width}x{device.height}
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg z-[999] pointer-events-none hidden sm:block">
      <div className="text-[10px] font-black uppercase tracking-widest space-y-1">
        <div>
          {device.isMobile ? '📱 Mobile' : device.isTablet ? '📱 Tablet' : '💻 Desktop'}
        </div>
        <div className="text-gray-400">
          {device.width}×{device.height} • {device.orientation}
        </div>
      </div>
    </div>
  );
};

export default DeviceCompatibilityInfo;
