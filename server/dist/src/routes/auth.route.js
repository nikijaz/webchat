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
const User_model_1 = __importDefault(require("../models/User.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = __importDefault(require("express"));
const auth_util_1 = require("../utils/auth.util");
const router = express_1.default.Router();
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const displayName = req.body["displayName"];
    const username = req.body["username"];
    const password = req.body["password"];
    if (yield User_model_1.default.countDocuments({ username: username }))
        return res.status(500).json("error");
    const user = yield User_model_1.default.create({
        displayName: displayName,
        username: username,
        password: bcrypt_1.default.hashSync(password, 10),
    });
    return res.status(200).json({
        id: user.id,
        token: (0, auth_util_1.generateToken)({ id: user.id }),
    });
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body["username"];
    const password = req.body["password"];
    const user = yield User_model_1.default.findOne({
        username: username,
    });
    if (!user)
        return res.status(500).json("username");
    if (!bcrypt_1.default.compareSync(password, user.password))
        return res.status(500).json("password");
    return res.status(200).json({
        id: user.id,
        token: (0, auth_util_1.generateToken)({ id: user.id }),
    });
}));
exports.default = router;
