"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_handler_1 = __importDefault(require("./auth.handler"));
const event_handler_1 = require("./event.handler");
const handler = (io) => {
    (0, auth_handler_1.default)(io);
    (0, event_handler_1.handler)(io);
};
exports.default = handler;
