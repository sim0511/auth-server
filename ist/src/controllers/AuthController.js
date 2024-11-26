function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
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
import { AuthService } from '../services/AuthService.js';
import { ValidationError } from '../errors/applicationError.js';
const authService = new AuthService();
export class AuthController {
    register(req, res, next) {
        return _async_to_generator(function*() {
            console.warn(req.body);
            const { username, email, password } = req.body;
            try {
                if (!username || !email || !password) {
                    throw new ValidationError('Username, email, and password are required.');
                }
                const user = yield authService.register(username, email, password);
                return res.status(201).json({
                    message: 'Registration successful'
                });
            } catch (error) {
                next(error); // Pass error to error handler middleware
            }
        })();
    }
    login(req, res, next) {
        return _async_to_generator(function*() {
            const { username, password } = req.body;
            console.log(req.body);
            try {
                if (!username || !password) {
                    throw new ValidationError('Username and password are required.');
                }
                const token = yield authService.login(username, password);
                return res.status(200).json({
                    message: 'Login successful',
                    token
                });
            } catch (error) {
                next(error); // Pass error to error handler middleware
            }
        })();
    }
}
