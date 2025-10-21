import React, { useEffect, useRef, useState } from 'react';
import { PROJECTED_TILE_SIZE } from '../constants';
import { SizeUtils } from '../utils/gridUtils';
import gridTileSvg from '/assets/grid-tile-bg.svg';

interface GridProps {
  zoom: number;
  scroll: { position: { x: number; y: number } };
}

export const Grid: React.FC<GridProps> = ({ zoom, scroll }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (!elementRef.current) return;

    const tileSize = SizeUtils.multiply(PROJECTED_TILE_SIZE, zoom);
    const elSize = elementRef.current.getBoundingClientRect();
    
    const backgroundPosition = {
      width: elSize.width / 2 + scroll.position.x + tileSize.width / 2,
      height: elSize.height / 2 + scroll.position.y
    };

    // Apply background size and position
    elementRef.current.style.backgroundSize = `${tileSize.width}px ${tileSize.height * 2}px`;
    elementRef.current.style.backgroundPosition = `${backgroundPosition.width}px ${backgroundPosition.height}px`;

    if (isFirstRender) {
      setIsFirstRender(false);
    }
  }, [scroll, zoom, isFirstRender]);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
    >
      <div
        ref={elementRef}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `repeat url("${gridTileSvg}")`
        }}
      />
    </div>
  );
};
