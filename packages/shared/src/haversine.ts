const EARTH_RADIUS_M = 6_371_000;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Returns distance in metres between two [lng, lat] GeoJSON coordinates. */
export function haversine(
  [lng1, lat1]: [number, number],
  [lng2, lat2]: [number, number],
): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a));
}

export function formatDistance(metres: number): string {
  if (metres < 1000) return `${Math.round(metres)}m away`;
  return `${(metres / 1000).toFixed(1)}km away`;
}
