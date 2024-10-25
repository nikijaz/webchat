import authRouter from "./auth.route";
import express from "express";
import userRouter from "./user.route";

const router = express.Router();

router.use(authRouter);
router.use(userRouter);

export default router;
