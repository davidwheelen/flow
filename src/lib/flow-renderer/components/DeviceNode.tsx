import React from 'react';
import { PeplinkDevice } from '@/types/network.types';
import { getTilePosition, Coords } from '../utils/gridUtils';
import { getDeviceIconUrl } from '../icons/iconFactory';
import { useCanvasStore } from '@/store/canvasStore';

interface DeviceNodeProps {
  device: PeplinkDevice;
  tile: Coords;
}

export const DeviceNode: React.FC<DeviceNodeProps> = ({ device, tile }) => {
  const { zoom, scroll, rendererSize, selectedDeviceId, setSelectedDeviceId } = useCanvasStore();
  
  // Calculate position using isoflow's getTilePosition
  const position = getTilePosition({ tile, origin: 'BOTTOM' });
  
  // Apply zoom and scroll transformations
  const screenX = position.x * zoom + scroll.position.x + rendererSize.width / 2;
  const screenY = position.y * zoom + scroll.position.y + rendererSize.height / 2;
  
  const iconUrl = getDeviceIconUrl(device.model);
  const isSelected = selectedDeviceId === device.id;
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDeviceId(isSelected ? null : device.id);
  };
  
  return (
    <div
      style={{
        position: 'absolute',
        left: screenX,
        top: screenY,
        transform: `translate(-50%, -50%) scale(${zoom})`,
        transformOrigin: 'center center',
        cursor: 'pointer',
        transition: 'transform 0.1s ease-out',
        pointerEvents: 'auto',
      }}
      onClick={handleClick}
    >
      {/* Device Icon */}
      {iconUrl && (
        <div
          style={{
            width: 60,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
            filter: isSelected ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))' : 'none',
          }}
        >
          <img
            src={iconUrl}
            alt={device.name}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
      )}
      
      {/* Device Label */}
      <div
        style={{
          color: isSelected ? '#60a5fa' : '#e0e0e0',
          fontSize: 12,
          fontWeight: 500,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
          userSelect: 'none',
        }}
      >
        {device.name}
      </div>
    </div>
  );
};
