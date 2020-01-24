import { Router, Request, Response, NextFunction } from 'express';
import { ShapeController } from '../../controllers/ShapeController';

// const router = Router({ mergeParams: true });
const controller = new ShapeController();

class DistanceRouter {
  router: Router;

  constructor() {
    this.router = Router({ mergeParams: true });
    this.init();
  }

  init() {
    
    /* GET distance between two georef points. */
    // this.router.get(
    //   '/',
    //   (req: Request, res: Response, next: NextFunction) =>
    //     controller.getDistanceBetweenPoints(req, res, next)
    // );


  }
}

export default new DistanceRouter().router;


