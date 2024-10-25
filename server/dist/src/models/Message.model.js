"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MessageSchema = new mongoose_1.default.Schema({
    from: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    to: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    when: {
        type: mongoose_1.default.Schema.Types.Date,
        required: true,
    },
    edited: {
        type: mongoose_1.default.Schema.Types.Boolean,
        required: true,
    },
    text: {
        type: mongoose_1.default.Schema.Types.String,
        required: true,
    },
});
const Message = mongoose_1.default.model("Message", MessageSchema, "messages");
exports.default = Message;
