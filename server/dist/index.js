"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const handler_1 = __importDefault(require("./src/handlers/handler"));
const mongoose_1 = __importDefault(require("mongoose"));
const router_1 = __importDefault(require("./src/routes/router"));
dotenv_1.default.config();
mongoose_1.default.connect(process.env.MONGODB_URI);
mongoose_1.default.Promise = global.Promise;
require("./src/models/User.model");
require("./src/models/Message.model");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    connectionStateRecovery: {},
    cors: { origin: "*" },
});
exports.io = io;
app.use((0, cors_1.default)({ origin: "*" }));
app.use(express_1.default.json());
(0, handler_1.default)(io);
app.use(router_1.default);
server.listen(process.env.EXPRESS_PORT, () => {
    console.log(`http://localhost:${process.env.EXPRESS_PORT}`);
});
