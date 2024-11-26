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
class ApplicationError extends Error {
    constructor(message, statusCode, details){
        super(message), _define_property(this, "statusCode", void 0), _define_property(this, "details", void 0);
        this.statusCode = statusCode;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
class ValidationError extends ApplicationError {
    constructor(message = 'Invalid request data', details){
        super(message, 400, details);
    }
}
class AuthenticationError extends ApplicationError {
    constructor(message = 'Authentication failed', details){
        super(message, 401, details);
    }
}
class AuthorizationError extends ApplicationError {
    constructor(message = 'Access denied', details){
        super(message, 403, details);
    }
}
class NotFoundError extends ApplicationError {
    constructor(message = 'Resource not found', details){
        super(message, 404, details);
    }
}
export { ApplicationError, ValidationError, AuthenticationError, AuthorizationError, NotFoundError };
