import { Request, Response, NextFunction } from 'express';

import { Point } from '../models/Point';
import { DistanceService, DistanceUnits } from '../services/DistanceService';
import { Shape } from '../models/Shape';
import { Segment } from '../models/Segment';
import { SegmentController } from './SegmentController';
import inPairs from 'inpairs';


export class ShapeController {
    private distanceService = new DistanceService();
    private segmentController = new SegmentController();

    constructor() {
    }

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

                const point1 = new Point([Number(pointA['lat']), Number(pointA['long'])]);
                const point2 = new Point([Number(pointB['lat']), Number(pointB['long'])]);

                segments.push(new Segment([point1, point2]));

            });

            const point1 = new Point([Number(up[up.length - 1]['lat']), Number(up[up.length - 1]['long'])]);
            const point2 = new Point([Number(up[0]['lat']), Number(up[0]['long'])]);

            segments.push(new Segment([point1, point2]));

            shapes.push(new Shape(segments));

        });

        return shapes;

    }

    removeDuplicates(shapes: Shape[]): Shape[] {

        shapes.forEach(shapeA => {
            shapes.forEach((shapeB, indexB) => {
                if (this.equivalent(shapeA, shapeB)) {
                    shapes.splice(indexB,1);
                }                
            });
        });

        return shapes;
    }

    mergeMultipleShapes(shapes: Shape[], allowDuplicates?:boolean): Shape {

        console.log('merge multiple con shapes: ', shapes);
        

        if (shapes.length === 1) return shapes[0];

        let result: Shape = new Shape([]);

        if (!allowDuplicates){
            shapes = this.removeDuplicates(shapes);
        }       
        
        console.log('desp de remover duplicados:', shapes);
        

        shapes.forEach((shape: Shape) => {
            result = this.mergeShapes(shape, result);
        });

        return result;

    }

    mergeShapes(shapeA: Shape, shapeB: Shape): Shape {
        let newSides = shapeA.sides.concat(...shapeB.sides);

        console.log('Original sides', newSides);

        newSides.forEach((sideA, indexA) => {
            newSides.forEach((sideB, indexB) => {

                if (this.segmentController.equivalentSegments(sideA, sideB)){
                    newSides.splice(indexA, 1);
                    newSides.splice(indexB, 1);
                }

            });
        });


        return new Shape(newSides);
    }
}