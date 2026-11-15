import { LatheGeometry, type BufferGeometry, Vector2 } from "three";

/**
 * A round brilliant cut, simplified: a lathe profile (pavilion point,
 * girdle, crown, table) swept with few segments so every face reads as a
 * flat facet. Non-indexed so flat shading gives each facet one normal.
 */
export function createGemGeometry(segments = 12): BufferGeometry {
  const profile = [
    new Vector2(0, -0.92), // pavilion point (culet)
    new Vector2(0.62, -0.46), // lower pavilion break
    new Vector2(1, -0.04), // girdle, lower edge
    new Vector2(1, 0.04), // girdle, upper edge
    new Vector2(0.8, 0.3), // crown
    new Vector2(0.54, 0.42), // table edge
    new Vector2(0, 0.42), // table centre
  ];
  const geometry = new LatheGeometry(profile, segments).toNonIndexed();
  geometry.computeVertexNormals();
  return geometry;
}
