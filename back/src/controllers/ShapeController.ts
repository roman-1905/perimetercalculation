import { Request, Response, NextFunction } from 'express';

import { Point } from '../models/Point';
import { DistanceService, DistanceUnits } from '../services/DistanceService';
import { Shape } from '../models/Shape';

export class ShapeController {
    private distanceService = new DistanceService();

    constructor() {
    }


    /**
     * Returns the distance between to points
     * @param pointA the origin point
     * @param pointB the destination point
     * @param unit the unit in which we want the distance to be returned ('km' | 'm' | 'mi' | 'ft')
     */

    getDistanceBetweenPoints(pointA: Point, pointB: Point, unit?: DistanceUnits): number {

        return this.distanceService.calculateDistance(pointA, pointB, unit );

    }

    /**
     * Obtains the perimeter of a shape
     * @param shape the shape which perimeter we want to calculate
     * @param unit the unit in which we want the distance to be returned ('km' | 'm' | 'mi' | 'ft')
     */

    getShapePerimeter(shape: Shape, unit?: DistanceUnits): number {

        return this.distanceService.aggregateDistance(shape.edges, unit );

    }

    /**
     * Returns a new shape which edges are the ones in points parameter
     * @param points (JSON with edges coordinates, usually retrieved from req.body)
     */

    makeShape(points: any): Shape {

        let edges: Point[] = [];

        points.map((point: any) => {
            edges.push(new Point([Number(point['lat']), Number(point['long'])]));
        })

        return new Shape(edges);

    }
}