import * as turf from "@turf/turf";
import HangZhou from "../../assets/JSON/HangZhou.json";

// 杭州的边界范围
const hzBoundaries: turf.Position[] =
  HangZhou.features[0].geometry.coordinates[0][0];

function generateUniformPoints(
  count: number,
  boundaries: turf.Feature<turf.Polygon>
): turf.Position[] {
  const points: turf.Position[] = [];
  const bbox: turf.BBox = turf.bbox(boundaries);
  const cellSizeX: number = (bbox[2] - bbox[0]) / Math.ceil(Math.sqrt(count));
  const cellSizeY: number = (bbox[3] - bbox[1]) / Math.ceil(Math.sqrt(count));

  for (let x = bbox[0] + cellSizeX / 2; x < bbox[2]; x += cellSizeX) {
    for (let y = bbox[1] + cellSizeY / 2; y < bbox[3]; y += cellSizeY) {
      const pt: turf.Feature<turf.Point> = turf.point([x, y]);
      if (turf.booleanPointInPolygon(pt, boundaries)) {
        points.push([
          x,
          y,
          Math.sin((x * Math.PI) ) * Math.cos((y * Math.PI) ) * 100,
        ]);
      }
      if (points.length >= count) {
        break;
      }
    }
    if (points.length >= count) {
      break;
    }
  }

  return points;
}

const boundaries: turf.Feature<turf.Polygon> = turf.polygon([hzBoundaries]);
const points: turf.Position[] = generateUniformPoints(30000, boundaries);

export default points;
