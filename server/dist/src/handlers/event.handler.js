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
exports.updateUser = exports.socketByUserid = exports.handler = void 0;
const Message_model_1 = __importDefault(require("../models/Message.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
const socketByUserid = new Map();
exports.socketByUserid = socketByUserid;
function updateUser(io, userId, userData) {
    io.sockets.emit("data", JSON.stringify(Array.from(new Map([[userId, userData]]))));
}
exports.updateUser = updateUser;
function updateStatus(io, userid) {
    User_model_1.default.findById(userid).then((user) => {
        io.sockets.emit("data", JSON.stringify(Array.from(new Map([
            [
                userid,
                {
                    displayName: user.displayName,
                    username: user.username,
                    status: socketByUserid.has(userid),
                },
            ],
        ]))));
    });
}
const handler = (io) => {
    io.on("connection", (socket) => {
        socketByUserid.set(socket.userid, socket);
        updateStatus(io, socket.userid);
        User_model_1.default.find().then((users) => {
            const userDataMap = new Map();
            users.forEach((user) => {
                userDataMap.set(user.id, {
                    displayName: user.displayName,
                    username: user.username,
                    status: socketByUserid.has(user.id),
                });
            });
            socket.emit("data", JSON.stringify(Array.from(userDataMap)));
        });
        Message_model_1.default.find()
            .or([{ from: socket.userid }, { to: socket.userid }])
            .then((messages) => socket.emit("addMessages", true, messages));
        socket.on("addMessage", (to, text) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const message = {
                from: socket.userid,
                to: to,
                when: new Date(),
                edited: false,
                text: text,
            };
            const result = yield Message_model_1.default.create(message);
            message._id = result.id;
            socket.emit("addMessages", false, [message]);
            (_a = socketByUserid.get(to)) === null || _a === void 0 ? void 0 : _a.emit("addMessages", false, [message]);
        }));
        socket.on("removeMessage", (to, id) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            yield Message_model_1.default.findByIdAndDelete(id);
            const messageIds = new Set([id]);
            socket.emit("removeMessages", JSON.stringify(Array.from(messageIds)));
            (_b = socketByUserid.get(to)) === null || _b === void 0 ? void 0 : _b.emit("removeMessages", JSON.stringify(Array.from(messageIds)));
        }));
        socket.on("editMessage", (to, id, text) => __awaiter(void 0, void 0, void 0, function* () {
            var _c;
            yield Message_model_1.default.findByIdAndUpdate(id, { edited: true, text: text });
            const textByMessageId = new Map([[id, text]]);
            socket.emit("editMessages", JSON.stringify(Array.from(textByMessageId)));
            (_c = socketByUserid.get(to)) === null || _c === void 0 ? void 0 : _c.emit("editMessages", JSON.stringify(Array.from(textByMessageId)));
        }));
        socket.on("disconnect", () => {
            socketByUserid.delete(socket.userid);
            updateStatus(io, socket.userid);
        });
    });
};
exports.handler = handler;
