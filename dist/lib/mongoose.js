"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectFromDb = exports.connectDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config"));
const clientOptions = {
    dbName: "bookstore",
    appName: "Bookstore API",
};
const connectDb = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!config_1.default.MONGODB_URI) {
        throw new Error("MongoDB URI is not defined");
    }
    try {
        console.log("DEBUG: ", config_1.default.MONGODB_URI, clientOptions);
        yield mongoose_1.default.connect(config_1.default.MONGODB_URI, clientOptions);
        console.log("DATABASE connected!", {
            uri: config_1.default.MONGODB_URI,
            options: clientOptions,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            throw err;
        }
        console.error("Error connecting to database: ", err);
    }
});
exports.connectDb = connectDb;
const disconnectFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.disconnect();
        console.log("Disconnected from DB successfully! ", {
            uri: config_1.default.MONGODB_URI,
            options: clientOptions,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message);
        }
        console.error("Error disconnecting from DB with error: ", err);
    }
});
exports.disconnectFromDb = disconnectFromDb;
