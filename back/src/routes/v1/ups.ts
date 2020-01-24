import { Router, Request, Response, NextFunction } from 'express';
import { UpController } from '../../controllers/UpController';

// const router = Router({ mergeParams: true });
const controller = new UpController();

class DistanceRouter {
  router: Router;

  constructor() {
    this.router = Router({ mergeParams: true });
    this.init();
  }

  init() {
    
    /* GET the perimiter of an UP. */
    this.router.get(
      '/getperimeter',
      (req: Request, res: Response, next: NextFunction) =>
        controller.getUpPerimeter(req, res)
    );

    /* GET the perimiter of several UPs. */
    this.router.get(
      '/getupsperimeter',
      (req: Request, res: Response, next: NextFunction) =>
        controller.getMultipleUpsPerimeter(req, res)
    );


  }
}

export default new DistanceRouter().router;


