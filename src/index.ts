/*=============================================
=            import external modules          =
=============================================*/

import express, { Application, NextFunction, Request, Response } from 'express';

import { AuthController } from './controllers/AuthController.js';
import AuthRoutes from './routes/auth.route.js';
import {Server as HttpServer} from 'http';
import UserRoutes from './routes/user.route.js';
import { config } from './config/config.js';
import connectToMongoDB from './utils/connectDB.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {corsOptions} from './config/cors.js';
import dotenv from 'dotenv';
import errorHandler from './middlewares/errorHandler.js';
import helmet from 'helmet';
import logger from './utils/logger.js';

/*=============================================
=            Import Custom Modules            =
=============================================*/



dotenv.config();


/*=====  End of Import Custom Modules  ======*/




class Server {
    private app:Application;
    private httpServer:HttpServer;
    constructor() {
        this.app = express();
        this.httpServer = new HttpServer(this.app); // wrapping the express app with Http Server
        this.setUpMiddlewares();
        this.setRoutes();
        this.app.use(errorHandler);
    }

// setting up middlewares
setUpMiddlewares():void {
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({limit: '50mb', extended:true}));
    this.app.use(helmet());
    this.app.use(cors(corsOptions));
    this.app.use(cookieParser());
}
// setting routes
    public setRoutes():void {
      this.app.use('/api/v1', this.v1Routes());
        this.app.get('/', (req:Request, res:Response, next:NextFunction) => {
            res.send('Hello World');           
    })
  }


  //  versioning routes
  private v1Routes(): express.Router {
    const router = express.Router();

    router.get('/', (req: Request, res: Response, next: NextFunction) => {
        res.send('Hello World from API v1');
    });
    
    // Define other v1 specific routes here
    const auth = new AuthController();
    // Define other v1 specific routes here
    router.use(AuthRoutes);
    router.use(UserRoutes);
    
    return router;
}
// start server 
    public async startServer(port:number):Promise<void> {
        try{
          await connectToMongoDB();
          this.httpServer.listen(port, () => 
          {
            //   logger.warn(
            // 'checking'
            //   )
              if(process.env.NODE_ENV === 'development'){
                
                logger.info(`Server is running on port ${port}`);
              }else{
                logger.info(`Server is running on port ${port}`);
                
              }
          });
        }catch(error){
            if(process.env.NODE_ENV === 'development'){
              logger.error(`Error: ${error}`);
             
            }else{
              logger.error(`Error: ${error}`);
               
            }
        
    }
} 
}

const server = new Server();
console.log('config.PORT', process.env.PORT);
server.startServer(Number(process.env.PORT));
