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
import dotenv from "dotenv";
import mongoose from "mongoose";
// import logger from "./logger/logger.js";
dotenv.config();
function connectToMongoDB() {
    return _connectToMongoDB.apply(this, arguments);
}
function _connectToMongoDB() {
    _connectToMongoDB = // connection to the database
    _async_to_generator(function*() {
        const mongoURI = `mongodb+srv://simrandeep2012:${process.env.MONGO_PASSWORD}@auth-server.wiwhj.mongodb.net/oauth?retryWrites=true&w=majority&appName=auth-server`;
        try {
            yield mongoose.connect(mongoURI);
            // logger.info('Connected to MongoDB successfully');
            console.log('Connected to MongoDB successfully');
        } catch (error) {
            // logger.error('Error connecting to MongoDB:', error);
            console.error('Error connecting to MongoDB:', error);
            throw new Error('Error connecting to MongoDB');
        }
    });
    return _connectToMongoDB.apply(this, arguments);
}
export default connectToMongoDB;
