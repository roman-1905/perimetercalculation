import { Request, Response, NextFunction } from 'express';

import { DistanceService, DistanceUnits } from '../services/DistanceService';
import { ShapeController } from './ShapeController';
import { Point } from '../models/Point';
import { Shape } from '../models/Shape';
import HTTP_STATUS from 'http-status-codes';

export class UpController {
    private distanceService = new DistanceService();
    private shapeController = new ShapeController();

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

        req.body.ups.map((up) => {
            console.log('IP', up);

            const shape = this.shapeController.makeShape(up);


            distance += this.shapeController.getShapePerimeter(shape, unit);

        });

        return res.status(HTTP_STATUS.OK).json({
            distance,
            unit: unit ? unit : 'm'
        })

    }

}