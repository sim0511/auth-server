/*=============================================
=            import external modules          =
=============================================*/
import express, { Application, Request, Response,NextFunction } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import {Server as HttpServer} from 'http';
import { config } from './config/config.js';


/*=============================================
=            Import Custom Modules            =
=============================================*/
import {corsOptions} from './config/cors.js';
import ApplicationError from './errors/applicationError.js';
import connectToMongoDB from './utils/connectDB.js';
/*=====  End of Import Custom Modules  ======*/

// Load environment variables
dotenv.config();



class Server {
    private app:Application;
    private httpServer:HttpServer;
    // private io:SocketIOServer;
    // public notificationService:NotificationService;
    constructor() {
        this.app = express();
        this.httpServer = new HttpServer(this.app); // wrapping the express app with Http Server
        this.setUpMiddlewares();
        this.setRoutes();
        this.app.use(this.errorHandler.bind(this));
    }

// setting up middlewares
setUpMiddlewares():void {
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({limit: '50mb', extended:true}));
    this.app.use(helmet());
    this.app.use(cors(corsOptions));
}

// setting port
    public setPort():number {
        const PORT:number = config.PORT;
        return PORT;
    }

// setting routes
    public setRoutes():void {
      this.app.use('/api/v1', this.v1Routes());
        this.app.get('/', (req:Request, res:Response, next:NextFunction) => {
            res.send('Hello World');           
    });
    }

  // error handler
    private errorHandler(err:any, req: Request, res: Response, next: NextFunction): void {
      // logger.error(err.stack);
      // console.log("hello")
      console.log(err)
      if(err instanceof ApplicationError){
      res.status(err.statusCode).json({ error: err.error,statusCode:err.statusCode,details: process.env.Node_ENV=="development"?err.details:null});
      }else{
        res.status(500).json({ error: 'Internal Server Error' });
      }
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
                console.log(`Server is running on port ${port}`)
                // logger.info(`Server is running on port ${port} and the user is ${userInfo.user}`);
              }else{
                // logger.info(`Server is running on port ${port}`);
                console.log(`Server is running on port ${port}`);
              }
          });
        }catch(error){
            if(process.env.NODE_ENV === 'development'){
              // logger.error(`Error: ${error} and the user is ${userInfo.user}`);
              console.log(`Error: ${error}`);
            }else{
                // logger.error(`Error: ${error}`);
                console.log(`Error: ${error}`);
            }
        
    }
} 
}

const server = new Server();
const PORT = server.setPort();
server.startServer(PORT);