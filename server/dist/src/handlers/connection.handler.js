"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler = (io) => {
    io.engine.on("connection", (socket) => {
        console.log("User Connected!");
    });
    io.engine.on("hello", (socket) => {
        console.log("Received Hello!");
    });
};
exports.default = handler;
