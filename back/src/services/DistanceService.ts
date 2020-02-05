import { Point } from "../models/Point";
import LatLon from "geodesy/latlon-nvector-spherical.js";
import inPairs from "inpairs";

import {
  DISTANCE_EQUIVALENCE_THRESHOLD,
  DISTANCE_DELTA
} from "../utils/constants";
import { Segment } from "../models/Segment";
import { SegmentController } from "../controllers/SegmentController";

export type DistanceUnits = "km" | "m" | "mi" | "ft";

export class DistanceService {
  constructor() {}

  /**
   * Returns the distance between two points
   * @param pointA the origin point
   * @param pointB the destination point
   * @param unit the unit in which we want the distance to be returned ('km' | 'm' | 'mi' | 'ft')
   */
  calculateDistance(
    point1: Point,
    point2: Point,
    unit?: DistanceUnits
  ): number {
    if (!point1 || !point2) return 0;

    let distance = 0;

    const p1 = new LatLon(point1.coordinates[0], point1.coordinates[1]);
    const p2 = new LatLon(point2.coordinates[0], point2.coordinates[1]);

    distance = p1.distanceTo(p2);

    if (unit) {
      distance = this.formatToUnit(distance, unit);
    }

    return distance;
  }

  /**
   * Returns the distance in a given format
   * @param distance the distance to apply the format
   * @param unit the unit to format to
   */

  formatToUnit(distance: number, unit: DistanceUnits): number {
    switch (unit) {
      case "km": {
        distance = distance / 1000;
        break;
      }
      case "ft": {
        distance = distance * 3.281;
        break;
      }
      case "mi": {
        distance = distance / 1609;
        break;
      }
    }

    return distance;
  }

  /**
   * Obtains the pairwise aggregated distance of the points passed in the parameter
   * @param points the array of points
   * @param unit the unit in which we want the distance to be returned ('km' | 'm' | 'mi' | 'ft')
   */
  aggregateDistance(points: Point[], unit?: DistanceUnits) {
    let totalDistance = 0;

    // pairwise aggregation of the distances

    inPairs(points, (pointA: Point, pointB: Point) => {
      totalDistance += this.calculateDistance(pointA, pointB, unit);
    });

    // add the distance between the first and last elements, not considered in inPairs

    totalDistance += this.calculateDistance(
      points[0],
      points[points.length],
      unit
    );

    return totalDistance;
  }

  /**
   * Return whether or not the points can be seen as the same point (because their distance is below certain threshold)
   * @param pointA
   * @param pointB
   */
  equivalentPoints(pointA: Point, pointB: Point): boolean {
    return (
      this.calculateDistance(pointA, pointB) < DISTANCE_EQUIVALENCE_THRESHOLD
    );
  }

  isBetween(a: Point, b: Point, c: Point, tolerance?: number): boolean {
    //test if the point c is inside a pre-defined distance (tolerance) from the line

    if (!tolerance) {
        tolerance = DISTANCE_EQUIVALENCE_THRESHOLD;
    }

    let distance = Math.abs(
      (c.getLatitude() -
        b.getLatitude() * a.getLongitude() -
        (c.getLongitude() - b.getLongitude()) * a.getLatitude() +
        c.getLongitude() * b.getLatitude() -
        c.getLatitude() * b.getLongitude()) /
        Math.sqrt(
          Math.pow(c.getLatitude() - b.getLatitude(), 2) +
            Math.pow(c.getLongitude() - b.getLongitude(), 2)
        )
    );
    if (distance > tolerance) return false;

    //test if the point c is between a and b
    let dotproduct = (c.getLongitude() - a.getLongitude()) * (b.getLongitude() - a.getLongitude()) + (c.getLatitude() - a.getLatitude()) * (b.getLatitude() - a.getLatitude());
    if (dotproduct < 0) {
      return false;
    }

    var squaredlengthba = (b.getLongitude() - a.getLongitude()) * (b.getLongitude() - a.getLongitude()) + (b.getLatitude() - a.getLatitude()) * (b.getLatitude() - a.getLatitude());
    if (dotproduct > squaredlengthba) {
      return false;
    }

    return true;
  }

  /**
   * Check if a point is part of a segment
   * @param point
   * @param segment
   */
  isEnclosed(point: Point, segment: Segment): boolean {
    console.log("\n en enclosed:");
    console.log("Point:", point);
    console.log("Segment: ");
    console.log(segment.edges);

    const result = this.isBetween(segment.getFirstPoint(), segment.getSecondPoint(), point);


    console.log(result);
    console.log("----------------\n");

    return result;
  }

  //   /**
  //    * Check if a point is part of a segment
  //    * @param point
  //    * @param segment
  //    */
  //   isEnclosed(point: Point, segment: Segment): boolean {
  //     console.log('\n en enclosed:');
  //     console.log('Point:', point);
  //     console.log('Segment: ');
  //     console.log(segment.edges);

  //     const p = new LatLon(point.coordinates[0], point.coordinates[1]);

  //     // We amplify the segment in every direction by a DELTA factor (in meters) to account for possible measuring mistakes

  //     // if (segment.getFirstPoint().getLatitude() < segment.getSecondPoint().getLatitude()) {

  //     // }

  //     const latEdge1 = segment.getFirstPoint().getLatitude();
  //     const latEdge2 = segment.getSecondPoint().getLatitude();
  //     const longEdge1 = segment.getFirstPoint().getLongitude();
  //     const longEdge2 = segment.getSecondPoint().getLongitude();

  //     const polygon = [
  //         // southern eastern point
  //       new LatLon(
  //         latEdge1 < latEdge2 ? segment.getFirstPoint().getLatitude() - DISTANCE_DELTA : segment.getSecondPoint().getLatitude() - DISTANCE_DELTA,
  //         longEdge1 < longEdge2 ? segment.getFirstPoint().getLongitude() - DISTANCE_DELTA : segment.getSecondPoint().getLongitude() - DISTANCE_DELTA
  //       ),
  //     //   southern western point
  //     new LatLon(
  //         latEdge1 < latEdge2 ? segment.getFirstPoint().getLatitude() - DISTANCE_DELTA : segment.getSecondPoint().getLatitude() - DISTANCE_DELTA,
  //         longEdge1 < longEdge2 ? segment.getSecondPoint().getLongitude() + DISTANCE_DELTA : segment.getFirstPoint().getLongitude() + DISTANCE_DELTA
  //       ),
  //     //   northern western point
  //     new LatLon(
  //         latEdge1 < latEdge2 ? segment.getSecondPoint().getLatitude() + DISTANCE_DELTA : segment.getFirstPoint().getLatitude() + DISTANCE_DELTA,
  //         longEdge1 < longEdge2 ? segment.getSecondPoint().getLongitude() + DISTANCE_DELTA : segment.getFirstPoint().getLongitude() + DISTANCE_DELTA
  //       ),
  //     //   northern eastern point
  //     new LatLon(
  //         latEdge1 < latEdge2 ? segment.getSecondPoint().getLatitude() + DISTANCE_DELTA : segment.getFirstPoint().getLatitude() + DISTANCE_DELTA,
  //         longEdge1 < longEdge2 ? segment.getFirstPoint().getLongitude() - DISTANCE_DELTA : segment.getSecondPoint().getLongitude() - DISTANCE_DELTA
  //       )
  //     ];

  //     console.log(polygon);

  //     const result = p.isEnclosedBy(polygon);

  //     // const result = p.isWithinExtent(new LatLon(
  //     //   segment.getFirstPoint().getLatitude(),
  //     //   segment.getFirstPoint().getLongitude()
  //     // ), new LatLon(
  //     //   segment.getSecondPoint().getLatitude(),
  //     //   segment.getSecondPoint().getLongitude()
  //     // ));

  //     console.log(result);
  //     console.log('----------------\n');

  //     return result;
  //   }

  closer(pointA: Point, pointB: Point, target: Point): Point {
    let result: Point;
    this.calculateDistance(pointA, target) <
    this.calculateDistance(pointB, target)
      ? (result = pointA)
      : (result = pointB);

    return result;
  }
}
