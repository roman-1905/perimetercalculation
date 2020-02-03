import { Request, Response, NextFunction } from 'express';

import { DistanceService, DistanceUnits } from '../services/DistanceService';
import { ShapeController } from './ShapeController';
import { Point } from '../models/Point';
import { Shape } from '../models/Shape';
import HTTP_STATUS from 'http-status-codes';
import { Segment } from '../models/Segment';
import inPairs from 'inpairs';
import { SegmentController } from './SegmentController';

export class UpController {
    private distanceService = new DistanceService();
    private shapeController = new ShapeController();
    private segmentController = new SegmentController();

    constructor() {
    }

    getUpPerimeter(req: Request, res: Response) {

        const shape = this.shapeController.makeShape(req.body.points);
        const unit: DistanceUnits = req.body.unit;

        const distance = this.shapeController.getShapePerimeter(shape, unit);

        return res.status(HTTP_STATUS.OK).json({
            distance,
            unit
        })

    }

    getMultipleUpsPerimeter(req: Request, res: Response) {

        let distance = 0;
        const unit: DistanceUnits = req.body.unit;

        let segments: Segment[] = [];

        req.body.ups.map((up: any) => {            

            inPairs(up, (pointA: any, pointB: any) => {

                const point1 = new Point([Number(pointA['lat']), Number(pointA['long'])]);
                const point2 = new Point([Number(pointB['lat']), Number(pointB['long'])]);

                segments.push(new Segment([point1, point2]));
    
            });

            const point1 = new Point([Number(up[up.length-1]['lat']), Number(up[up.length-1]['long'])]);
            const point2 = new Point([Number(up[0]['lat']), Number(up[0]['long'])]);

            segments.push(new Segment([point1, point2]));          

        });

        distance += this.segmentController.aggregateSegments(segments, unit);

        return res.status(HTTP_STATUS.OK).json({
            distance,
            unit: unit ? unit : 'm'
        })

    }



}