// Original Isoflow grid constants
export const UNPROJECTED_TILE_SIZE = 100;

export const TILE_PROJECTION_MULTIPLIERS = {
  width: 1.415,
  height: 0.819
};

export const PROJECTED_TILE_SIZE = {
  width: UNPROJECTED_TILE_SIZE * TILE_PROJECTION_MULTIPLIERS.width,  // 141.5px
  height: UNPROJECTED_TILE_SIZE * TILE_PROJECTION_MULTIPLIERS.height // 81.9px
};

export const ZOOM_INCREMENT = 0.2;
export const MIN_ZOOM = 0.2;
export const MAX_ZOOM = 1;
