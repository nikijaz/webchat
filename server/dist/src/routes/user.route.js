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
const event_handler_1 = require("../handlers/event.handler");
const User_model_1 = __importDefault(require("../models/User.model"));
const express_1 = __importDefault(require("express"));
const __1 = require("../..");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
router.get("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_model_1.default.findById(req.params.id);
    res.status(200).json({
        displayName: user === null || user === void 0 ? void 0 : user.displayName,
        username: user === null || user === void 0 ? void 0 : user.username,
        status: event_handler_1.socketByUserid.has(req.params.id),
    });
}));
router.get("/userid/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_model_1.default.findOne({ username: req.params.username });
    if (!user)
        return res.status(500).json("error");
    res.status(200).json({
        id: user.id,
    });
}));
router.use((req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer "))
        return next(new Error());
    const token = header.substring(7);
    jsonwebtoken_1.default.verify(token, process.env.JWT_TOKEN, () => {
        var _a;
        const payload = (_a = jsonwebtoken_1.default.decode(token, { complete: true })) === null || _a === void 0 ? void 0 : _a.payload;
        req.userid = payload.id;
        next();
    });
});
router.post("/edit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_model_1.default.findById(req.userid);
    if (req.body["username"] && req.body["username"] !== (user === null || user === void 0 ? void 0 : user.username) && (yield User_model_1.default.countDocuments({ username: req.body["username"] }))) {
        return res.status(500).json("error");
    }
    yield User_model_1.default.findByIdAndUpdate(req.userid, {
        displayName: req.body["displayName"] ? req.body["displayName"] : user === null || user === void 0 ? void 0 : user.displayName,
        username: req.body["username"] ? req.body["username"] : user === null || user === void 0 ? void 0 : user.username,
    });
    (0, event_handler_1.updateUser)(__1.io, req.userid, {
        displayName: req.body["displayName"] ? req.body["displayName"] : user === null || user === void 0 ? void 0 : user.displayName,
        username: req.body["username"] ? req.body["username"] : user === null || user === void 0 ? void 0 : user.username,
        status: event_handler_1.socketByUserid.has(req.userid),
    });
    return res.status(200).json("success");
}));
exports.default = router;
