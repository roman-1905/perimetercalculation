import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { DistanceService, DistanceUnits } from '../services/DistanceService';
import { SegmentController } from './SegmentController';
import { ShapeController } from './ShapeController';
import { Shape } from '../models/Shape';


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

    async getMultipleUpsPerimeter(req: Request, res: Response) {

        let distance = 0;

        const unit: DistanceUnits = req.body.unit;     
        const ups = this.shapeController.makeShapes(req.body.ups);   

        

        // merge multiple UPs into a single UP with only the perimeter from the set of original UPs
        let globalUP: Shape;
        ups.length === 1 ? globalUP = ups[0] : globalUP = await this.shapeController.mergeMultipleShapes(ups);

        this.shapeController.logShape(globalUP, 'GlobalUP');

        distance = this.shapeController.getShapePerimeter(globalUP, unit);

        return res.status(HTTP_STATUS.OK).json({
            distance,
            unit: unit ? unit : 'm'
        })

    }

}