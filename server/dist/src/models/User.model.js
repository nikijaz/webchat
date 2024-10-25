"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    displayName: {
        type: mongoose_1.default.Schema.Types.String,
        required: true,
    },
    username: {
        type: mongoose_1.default.Schema.Types.String,
        required: true,
        unique: true,
    },
    password: {
        type: mongoose_1.default.Schema.Types.String,
        required: true,
    },
});
const User = mongoose_1.default.model("User", UserSchema, "users");
exports.default = User;
