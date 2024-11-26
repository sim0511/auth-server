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
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
import { ApplicationError } from '../errors/applicationError.js';
import logger from '../utils/logger.js';
function errorHandler(err, req, res, next) {
    let statusCode = 500;
    let message = 'Internal Server Error';
    if (err instanceof ApplicationError) {
        // Custom application errors
        statusCode = err.statusCode;
        message = err.message;
        logger.error(`Error: ${message}, Details: ${err.details || 'N/A'}`);
    } else {
        // Unhandled or unknown errors
        logger.error(`Unexpected error: ${err.stack}`);
    }
    res.status(statusCode).json(_object_spread({
        status: 'error',
        message
    }, process.env.NODE_ENV === 'development' && {
        stack: err.stack
    } // Include stack trace in development
    ));
}
export default errorHandler;
