"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const handler = (io) => {
    io.use((socket, next) => {
        const header = socket.handshake.auth.header;
        if (!header || !header.startsWith("Bearer ")) {
            return next(new Error());
        }
        const token = header.substring(7);
        jsonwebtoken_1.default.verify(token, process.env.JWT_TOKEN, () => {
            var _a;
            const payload = (_a = jsonwebtoken_1.default.decode(token, { complete: true })) === null || _a === void 0 ? void 0 : _a.payload;
            socket.userid = payload.id;
            next();
        });
    });
};
exports.default = handler;
