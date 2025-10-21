import { PROJECTED_TILE_SIZE } from '../constants';

export interface Coords {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type TileOrigin = 'CENTER' | 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT';

/**
 * Convert screen coordinates to isometric tile coordinates
 * From original Isoflow: src/utils/renderer.ts
 */
export interface ScreenToIso {
  mouse: Coords;
  zoom: number;
  scroll: { position: Coords };
  rendererSize: Size;
}

export const screenToIso = ({
  mouse,
  zoom,
  scroll,
  rendererSize
}: ScreenToIso): Coords => {
  const projectedTileSize = {
    width: PROJECTED_TILE_SIZE.width * zoom,
    height: PROJECTED_TILE_SIZE.height * zoom
  };
  const halfW = projectedTileSize.width / 2;
  const halfH = projectedTileSize.height / 2;

  const projectPosition = {
    x: -rendererSize.width * 0.5 + mouse.x - scroll.position.x,
    y: -rendererSize.height * 0.5 + mouse.y - scroll.position.y
  };

  const tile = {
    x: Math.floor(
      (projectPosition.x + halfW) / projectedTileSize.width -
        projectPosition.y / projectedTileSize.height
    ),
    y: -Math.floor(
      (projectPosition.y + halfH) / projectedTileSize.height +
        projectPosition.x / projectedTileSize.width
    )
  };

  return tile;
};

/**
 * Get screen position for a tile coordinate
 * From original Isoflow: src/utils/renderer.ts
 */
export interface GetTilePosition {
  tile: Coords;
  origin?: TileOrigin;
}

export const getTilePosition = ({
  tile,
  origin = 'CENTER'
}: GetTilePosition): Coords => {
  const halfW = PROJECTED_TILE_SIZE.width / 2;
  const halfH = PROJECTED_TILE_SIZE.height / 2;

  const position: Coords = {
    x: halfW * tile.x - halfW * tile.y,
    y: -(halfH * tile.x + halfH * tile.y)
  };

  switch (origin) {
    case 'TOP':
      return { x: position.x, y: position.y - halfH };
    case 'BOTTOM':
      return { x: position.x, y: position.y + halfH };
    case 'LEFT':
      return { x: position.x - halfW, y: position.y };
    case 'RIGHT':
      return { x: position.x + halfW, y: position.y };
    case 'CENTER':
    default:
      return position;
  }
};

/**
 * Convert isometric tile to screen coordinates
 * From original Isoflow: src/utils/renderer.ts
 */
export interface IsoToScreen extends GetTilePosition {
  rendererSize: Size;
}

export const isoToScreen = ({
  tile,
  origin,
  rendererSize
}: IsoToScreen): Coords => {
  const position = getTilePosition({ tile, origin });

  return {
    x: position.x + rendererSize.width / 2,
    y: position.y + rendererSize.height / 2
  };
};

export const SizeUtils = {
  multiply: (size: Size, multiplier: number): Size => ({
    width: size.width * multiplier,
    height: size.height * multiplier
  })
};
