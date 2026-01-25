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
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = require("./lib/mongoose");
const config_1 = __importDefault(require("./config"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cookie_session_1.default)({
    name: "session",
    keys: ["qwerty"],
    maxAge: 24 * 60 * 60 * 1000,
}));
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, mongoose_1.connectDb)();
        app.get("/ping", (req, res) => res.json({ status: "ok" }));
        app.listen(config_1.default.PORT, () => {
            console.log(`> Server listening at ${config_1.default.BASE_URL}:${config_1.default.PORT} as ${process.env.NODE_ENV}`);
        });
    }
    catch (err) {
        if (config_1.default.NODE_ENV === "production") {
            process.exit(1);
        }
    }
}))();
const handleServerShutdown = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, mongoose_1.disconnectFromDb)();
        console.log("Server SHUTDOWN");
        process.exit(0);
    }
    catch (err) {
        console.log("Error during server shutdown: ", err);
    }
});
process.on("SIGTERM", handleServerShutdown);
process.on("SIGINT", handleServerShutdown);
