import { Request, Response, NextFunction } from "express";

import { Point } from "../models/Point";
import { Segment } from "../models/Segment";
import { DistanceService, DistanceUnits } from "../services/DistanceService";
import { Shape } from "../models/Shape";

export class SegmentController {
  private distanceService = new DistanceService();

  constructor() {}

  /**
   * Returns the distance between the edges of a segment
   * @param pointA the origin point
   * @param pointB the destination point
   * @param unit the unit in which we want the distance to be returned ('km' | 'm' | 'mi' | 'ft')
   */

  getDistanceBetweenSegmentEdges(edge: Segment, unit?: DistanceUnits): number {
    return this.distanceService.calculateDistance(
      edge.getFirstPoint(),
      edge.getSecondPoint(),
      unit
    );
  }

  /**
   * Returns wheter or not two segments are equivalent, that is, they have the same edges (using the threshold distance)
   * @param segmentA
   * @param segmentB
   */
  equivalentSegments(segmentA: Segment, segmentB: Segment): boolean {
    return (
      this.isEdge(segmentA, segmentB.getFirstPoint()) &&
      this.isEdge(segmentA, segmentB.getSecondPoint())
    );
  }

  isContained(containee: Segment, container: Segment): boolean {
    return (
      this.distanceService.isEnclosed(containee.getFirstPoint(), container) &&
      this.distanceService.isEnclosed(containee.getSecondPoint(), container)
    );
  }

  /**
   * Returns wheter or not a point is an edge in a segment (using the threshold distance)
   * @param segment the segment
   * @param point the point to check
   */
  isEdge(segment: Segment, point: Point): boolean {
    return (
      this.distanceService.equivalentPoints(segment.getFirstPoint(), point) ||
      this.distanceService.equivalentPoints(segment.getSecondPoint(), point)
    );
  }

  removeRepeatedSegments(segments: Segment[]): Segment[] {
    console.log("original Segments[] en repeated: ", segments);

    segments.forEach(segment => {
      segments.forEach((anotherSegment, i) => {
        if (
          this.equivalentSegments(segment, anotherSegment) &&
          segment !== anotherSegment
        ) {
          console.count("Remove Segment");
          console.log(
            anotherSegment.getFirstPoint(),
            anotherSegment.getSecondPoint()
          );

          segments.splice(i, 1);
        }
      });
    });

    console.log("result:", segments);

    return segments;
  }
  /**
   * Remove all segments that are contained in another one in the set
   * @param segments the segments to check
   */
  removeCointained(segments: Segment[]): Segment[] {
    console.log("original Segments[] en contained: ", segments);

    segments.forEach(segment => {
      segments.forEach((anotherSegment, i) => {
        if (
          this.isContained(anotherSegment, segment) &&
          segment !== anotherSegment
        ) {
          console.count("Remove contained Segment");
          console.log(
            anotherSegment.getFirstPoint(),
            anotherSegment.getSecondPoint()
          );

          segments.splice(i, 1);
        }
      });
    });

    console.log("result:", segments);

    return segments;
  }

  /**
   * Take an array of segments and aggregate their distance, disregarding
   * @param segments the segments to aggregate
   * @param unit the unit in which we want the distance to be returned ('km' | 'm' | 'mi' | 'ft')
   * @param allowRepeated wheter or not we should account for repeated segments
   */
  aggregateSegments(
    segments: Segment[],
    unit?: DistanceUnits,
    allowRepeated?: boolean,
    allowOverlap?: boolean
  ): number {
    let distance = 0;

    if (!allowRepeated) {
      segments = this.removeRepeatedSegments(segments);
    }

    if (!allowOverlap) {
      segments = this.removeCointained(segments);
    }

    segments.map((segment: Segment) => {
      distance += this.getDistanceBetweenSegmentEdges(segment, unit);
    });

    return distance;
  }

  addSegment(segment: Segment, segments: Segment[], distance: number): number {
    // segment has no overlap with the rest of the segments

    return distance;
  }
}
