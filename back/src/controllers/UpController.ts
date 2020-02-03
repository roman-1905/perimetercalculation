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

    // getUpPerimeter(req: Request, res: Response) {

    //     const shape = this.shapeController.makeShape(req.body.points);
    //     const unit: DistanceUnits = req.body.unit;

    //     const distance = this.shapeController.getShapePerimeter(shape, unit);

    //     return res.status(HTTP_STATUS.OK).json({
    //         distance,
    //         unit
    //     })

    // }

    getMultipleUpsPerimeter(req: Request, res: Response) {

        let distance = 0;

        const unit: DistanceUnits = req.body.unit;     
        const ups = this.shapeController.makeShapes(req.body.ups);   

        // obtain a single UP with only the perimeter from the set of original UPs
        const globalUP = this.shapeController.mergeMultipleShapes(ups);

        console.log('Globslup:', globalUP);
        
                

        ups.map((up: Shape) => {
            distance += this.shapeController.getShapePerimeter(up, unit);
        })

        return res.status(HTTP_STATUS.OK).json({
            distance,
            unit: unit ? unit : 'm'
        })

    }

}