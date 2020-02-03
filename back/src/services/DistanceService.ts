import { Point } from "../models/Point";
import LatLon from "geodesy/latlon-nvector-spherical.js";
import inPairs from "inpairs";

import { DISTANCE_EQUIVALENCE_THRESHOLD, DISTANCE_DELTA } from "../utils/constants";
import { Segment } from "../models/Segment";

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

  /**
   * Check if a point is part of a segment
   * @param point 
   * @param segment 
   */
  isEnclosed(point: Point, segment: Segment): boolean {

    const p = new LatLon(point.coordinates[0], point.coordinates[1]);

    // We amplify the segment in every direction by a DELTA factor (in meters) to account for possible measuring mistakes

    const polygon = [
        new LatLon(segment.getFirstPoint().getLatitude() + DISTANCE_DELTA, segment.getFirstPoint().getLongitude() + DISTANCE_DELTA),
        new LatLon(segment.getFirstPoint().getLatitude() - DISTANCE_DELTA, segment.getFirstPoint().getLongitude() - DISTANCE_DELTA),
        new LatLon(segment.getSecondPoint().getLatitude() + DISTANCE_DELTA, segment.getSecondPoint().getLongitude() + DISTANCE_DELTA),
        new LatLon(segment.getSecondPoint().getLatitude() - DISTANCE_DELTA, segment.getSecondPoint().getLongitude() - DISTANCE_DELTA)        
    ];

   return p.isEnclosedBy(polygon);
  }
}
