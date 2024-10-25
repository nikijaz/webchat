import User from "../models/User.model";
import bcrypt from "bcrypt";
import express from "express";
import { generateToken } from "../utils/auth.util";

const router = express.Router();

router.post("/register", async (req, res) => {
    const displayName: string = req.body["displayName"];
    const username: string = req.body["username"];
    const password: string = req.body["password"];

    if (await User.countDocuments({ username: username })) return res.status(500).json("error");

    const user = await User.create({
        displayName: displayName,
        username: username,
        password: bcrypt.hashSync(password, 10),
    });

    return res.status(200).json({
        id: user.id,
        token: generateToken({ id: user.id }),
    });
});

router.post("/login", async (req, res) => {
    const username: string = req.body["username"];
    const password: string = req.body["password"];

    const user = await User.findOne({
        username: username,
    });

    if (!user) return res.status(500).json("username");
    if (!bcrypt.compareSync(password, user.password)) return res.status(500).json("password");
    return res.status(200).json({
        id: user.id,
        token: generateToken({ id: user.id }),
    });
});

export default router;
