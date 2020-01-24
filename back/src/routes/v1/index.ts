import { Router, Request, Response, NextFunction } from 'express';
import HTTP_STATUS from 'http-status-codes'


// Routers de recursos
 import DistanceRouter from './distance';
 import UpRouter from './ups';

/*
 ======================== ROUTES ================================
 */

class AppRouter {
    router: Router;
    constructor() {
      this.router = Router();
      this.init();
    }
  
    private init() {

      // Ruta principal '/'
        this.router.get('/', (req: Request, res: Response, next: NextFunction) => {
            res.status(HTTP_STATUS.OK).json({
                ok: true,
                message: 'Peticion realizada correctamente'
            });
        })

        // Rutas a Recursos
        this.router.use('/distancias', DistanceRouter);
        this.router.use('/ups', UpRouter);
    }
  }

export const apiRouter = new AppRouter().router;