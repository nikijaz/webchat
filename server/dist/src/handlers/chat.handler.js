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
const Message_model_1 = __importDefault(require("../models/Message.model"));
const socketByUsername = new Map();
const handler = (io) => {
    io.on("connection", (socket) => {
        socketByUsername.set(socket.username, socket);
        socket.broadcast.emit("status", socket.username, true);
        Message_model_1.default.find()
            .or([{ from: socket.username }, { to: socket.username }])
            .then((result) => {
            socket.emit("chat", result);
        });
        socket.on("chat", (message) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const fullMessage = Object.assign(Object.assign({}, message), { from: socket.username, when: new Date() });
            yield Message_model_1.default.create(fullMessage);
            socket.emit("chat", [fullMessage]);
            (_a = socketByUsername.get(message.to)) === null || _a === void 0 ? void 0 : _a.emit("chat", [fullMessage]);
        }));
        socket.on("disconnect", () => {
            socketByUsername.delete(socket.username);
        });
    });
};
exports.default = handler;
