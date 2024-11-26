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
import { AuthenticationError, ValidationError } from '../errors/applicationError.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { config } from '../config/config.js';
import jwt from 'jsonwebtoken';
export class AuthService {
    register(username, email, password) {
        return _async_to_generator(function*() {
            const existingUser = yield User.findOne({
                username
            });
            if (existingUser) {
                throw new ValidationError(`Username "${username}" is already taken.`);
            }
            const passwordHash = yield bcrypt.hash(password, config.saltRounds);
            const user = new User({
                username,
                email,
                passwordHash
            });
            return user.save();
        })();
    }
    login(username, password) {
        return _async_to_generator(function*() {
            const user = yield User.findOne({
                username
            });
            if (!user) {
                throw new AuthenticationError('Invalid username or password.');
            }
            const passwordMatch = yield bcrypt.compare(password, user.passwordHash);
            if (!passwordMatch) {
                throw new AuthenticationError('Invalid username or password.');
            }
            if (!config.JWT_SECRET) {
                throw new Error('JWT_SECRET is not defined in the configuration.');
            }
            const token = jwt.sign({
                userId: user._id,
                username: user.username
            }, config.JWT_SECRET, {
                expiresIn: config.tokenExpiration
            });
            return token;
        })();
    }
}
