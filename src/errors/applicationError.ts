class ApplicationError extends Error {
    public statusCode: number;
    public details: any;
    constructor(message:string, statusCode:number,details?:string){
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
  }

class ValidationError extends ApplicationError {
    constructor(message = 'Invalid request data', details?: string) {
      super(message, 400, details);
    }
  }
  
  class AuthenticationError extends ApplicationError {
    constructor(message = 'Authentication failed', details?: string) {
      super(message, 401, details);
    }
  }
  
  class AuthorizationError extends ApplicationError {
    constructor(message = 'Access denied', details?: string) {
      super(message, 403, details);
    }
  }
  
  class NotFoundError extends ApplicationError {
    constructor(message = 'Resource not found', details?: string) {
      super(message, 404, details);
    }
  }
export {ApplicationError,ValidationError,AuthenticationError,AuthorizationError,NotFoundError};
