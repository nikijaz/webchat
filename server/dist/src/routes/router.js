"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_route_1 = __importDefault(require("./auth.route"));
const express_1 = __importDefault(require("express"));
const user_route_1 = __importDefault(require("./user.route"));
const router = express_1.default.Router();
router.use(auth_route_1.default);
router.use(user_route_1.default);
exports.default = router;
