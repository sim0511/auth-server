/*=============================================
=            import external modules          =
=============================================*/

import express, { Application, NextFunction, Request, Response } from 'express';

import {Server as HttpServer} from 'http';
import { config } from './config/config.js';
import connectToMongoDB from './utils/connectDB.js';
import cors from 'cors';
import {corsOptions} from './config/cors.js';
import errorHandler from './middlewares/errorHandler.js';
import helmet from 'helmet';
import logger from './utils/logger.js';

/*=============================================
=            Import Custom Modules            =
=============================================*/



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
}



// setting routes
    public setRoutes():void {
      this.app.use('/api/v1', this.v1Routes());
        this.app.get('/', (req:Request, res:Response, next:NextFunction) => {
            res.send('Hello World');           
    });
    }


  //  versioning routes
  private v1Routes(): express.Router {
    const router = express.Router();

    router.get('/', (req: Request, res: Response, next: NextFunction) => {
        res.send('Hello World from API v1');
    });

    // Define other v1 specific routes here
    
   
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

server.startServer(config.PORT);
