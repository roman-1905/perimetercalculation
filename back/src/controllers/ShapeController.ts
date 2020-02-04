import { Request, Response, NextFunction } from "express";

import { Point } from "../models/Point";
import { DistanceService, DistanceUnits } from "../services/DistanceService";
import { Shape } from "../models/Shape";
import { Segment } from "../models/Segment";
import { SegmentController } from "./SegmentController";
import inPairs from "inpairs";

export class ShapeController {
  private distanceService = new DistanceService();
  private segmentController = new SegmentController();

  constructor() { }

  /**
   * Obtains the perimeter of a shape
   * @param shape the shape which perimeter we want to calculate
   * @param unit the unit in which we want the distance to be returned ('km' | 'm' | 'mi' | 'ft')
   */

  getShapePerimeter(shape: Shape, unit?: DistanceUnits): number {
    return this.segmentController.aggregateSegments(shape.sides, unit);
  }

  equivalent(shapeA: Shape, shapeB: Shape): boolean {
    if (shapeA.sides.length !== shapeB.sides.length) {
      return false;
    }

    let equivalentSides = 0;
    shapeA.sides.map((sideA: Segment) => {
      shapeB.sides.map((sideB: Segment) => {
        if (this.segmentController.equivalentSegments(sideA, sideB)) {
          equivalentSides++;
        }
      });
    });

    return equivalentSides === shapeA.sides.length;
  }

  /**
   * Return an array of Shape objects based on the passed coordinates
   * @param data the coordinates, usually retrieved from the request
   */

  makeShapes(data: any): Shape[] {
    let shapes: Shape[] = [];

    data.map((up: any) => {
      let segments: Segment[] = [];

      inPairs(up, (pointA: any, pointB: any) => {
        const point1 = new Point([
          Number(pointA["lat"]),
          Number(pointA["long"])
        ]);
        const point2 = new Point([
          Number(pointB["lat"]),
          Number(pointB["long"])
        ]);

        segments.push(new Segment([point1, point2]));
      });

      const point1 = new Point([
        Number(up[up.length - 1]["lat"]),
        Number(up[up.length - 1]["long"])
      ]);
      const point2 = new Point([Number(up[0]["lat"]), Number(up[0]["long"])]);

      segments.push(new Segment([point1, point2]));

      shapes.push(new Shape(segments));
    });

    return shapes;
  }

  logShape(shape: Shape, leyend?: string) {
    let title: string;
    leyend ? title = `${leyend} - Shape: ` : title = 'Shape';
    console.log(title);
    shape.sides.forEach((side: Segment) => {
      console.log("Segment:", side.getFirstPoint(), side.getSecondPoint());
    });
  }

  removeDuplicates(shapes: Shape[]): Shape[] {
    shapes.forEach((shapeA, indexA) => {
      shapes.forEach((shapeB, indexB) => {
        if (indexA !== indexB && this.equivalent(shapeA, shapeB)) {
          console.log("remove duplicate:");
          this.logShape(shapeA);
          this.logShape(shapeB);
          shapes.splice(indexB, 1);
        }
      });
    });

    return shapes;
  }

  mergeMultipleShapes(shapes: Shape[]): Shape {

    let result: Shape = new Shape([]);

    // Build a new shape that only has the perimeter of the original shapes
    shapes.forEach((shape: Shape) => {
      result = this.mergeShapes(shape, result);
      // this.logShape(shape, '\n Shape to merge');
      // this.logShape(result, 'Result ');
      // console.log('\n');
      


    });

    return result;
  }

  /**
   * Merge two shapes into a new one that only has their external segments, disregarding internal ones
   * @param shapeA
   * @param shapeB
   */

  mergeShapes(shapeA: Shape, shapeB: Shape): Shape {
    let newSides = shapeA.sides.concat(...shapeB.sides);

    console.log("Original sides:");
    newSides.forEach((segment: Segment) => {
      console.log(segment.getFirstPoint(), segment.getSecondPoint());
    });

    newSides.forEach((sideA, indexA) => {
      newSides.forEach((sideB, indexB) => {
        console.log('por chequear: ');
        this.segmentController.logSegment(sideA,'SideA');
        this.segmentController.logSegment(sideB, 'SideB');        
        
        // if it is NOT the same element
        if (indexA !== indexB) {
          console.log('No son iguales, entra a comparar');
          
          // If the segments are equivalent remove them
          if (this.segmentController.equivalentSegments(sideA, sideB)) {
            console.log(
              "Remove equivalent: ",
              sideB.getFirstPoint(),
              sideB.getSecondPoint()
            );

            newSides.splice(indexA, 1);
            newSides.splice(indexB, 1);
          }

          //   If a segment is contained in another one we should disregard it and also erase that portion form the container segment

          if (this.segmentController.isContained(sideB, sideA)) {
            console.log(
              "Remove containee: ",
              sideB.getFirstPoint(),
              sideB.getSecondPoint()
            );
            // remove containee
            newSides.splice(indexB, 1);

            // remove the container, and add two subsegments (the result of substracting the containee from the container)
            newSides.splice(indexA, 1);
            newSides.push(
              ...this.segmentController.deleteContaineeFromContainer(
                sideB,
                sideA
              )
            );
          }
        }
        console.log('---------------\n');
      });
    });

    return new Shape(newSides);
  }
}
