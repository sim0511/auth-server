/*=============================================
=            import external modules          =
=============================================*/ function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
import express from 'express';
import { AuthController } from './controllers/AuthController.js';
import { Server as HttpServer } from 'http';
import { config } from './config/config.js';
import connectToMongoDB from './utils/connectDB.js';
import cors from 'cors';
import { corsOptions } from './config/cors.js';
import errorHandler from './middlewares/errorHandler.js';
import helmet from 'helmet';
import logger from './utils/logger.js';
/*=============================================
=            Import Custom Modules            =
=============================================*/ /*=====  End of Import Custom Modules  ======*/ class Server {
    // setting up middlewares
    setUpMiddlewares() {
        this.app.use(express.json({
            limit: '50mb'
        }));
        this.app.use(express.urlencoded({
            limit: '50mb',
            extended: true
        }));
        this.app.use(helmet());
        this.app.use(cors(corsOptions));
    }
    // setting routes
    setRoutes() {
        this.app.use('/api/v1', this.v1Routes());
        this.app.get('/', (req, res, next)=>{
            res.send('Hello World');
        });
    }
    //  versioning routes
    v1Routes() {
        const router = express.Router();
        router.get('/', (req, res, next)=>{
            res.send('Hello World from API v1');
        });
        // Define other v1 specific routes here
        const auth = new AuthController();
        router.post('/register', auth.register.bind(AuthController));
        router.post('/login', auth.login.bind(AuthController));
        return router;
    }
    // start server 
    startServer(port) {
        var _this = this;
        return _async_to_generator(function*() {
            try {
                yield connectToMongoDB();
                _this.httpServer.listen(port, ()=>{
                    //   logger.warn(
                    // 'checking'
                    //   )
                    if (process.env.NODE_ENV === 'development') {
                        logger.info(`Server is running on port ${port}`);
                    } else {
                        logger.info(`Server is running on port ${port}`);
                    }
                });
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    logger.error(`Error: ${error}`);
                } else {
                    logger.error(`Error: ${error}`);
                }
            }
        })();
    }
    constructor(){
        _define_property(this, "app", void 0);
        _define_property(this, "httpServer", void 0);
        this.app = express();
        this.httpServer = new HttpServer(this.app); // wrapping the express app with Http Server
        this.setUpMiddlewares();
        this.setRoutes();
        this.app.use(errorHandler);
    }
}
const server = new Server();
server.startServer(config.PORT);
