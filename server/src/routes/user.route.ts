import { socketByUserid, updateUser } from "../handlers/event.handler";

import User from "../models/User.model";
import express from "express";
import { io } from "../..";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/user/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    res.status(200).json({
        displayName: user?.displayName,
        username: user?.username,
        status: socketByUserid.has(req.params.id),
    });
});

router.get("/userid/:username", async (req, res) => {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(500).json("error");
    res.status(200).json({
        id: user.id,
    });
});

router.use((req, res, next) => {
    const header: string | undefined = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) return next(new Error());

    const token: string = header.substring(7);
    jwt.verify(token, process.env.JWT_TOKEN as string, () => {
        const payload: { id: string } = jwt.decode(token, { complete: true })?.payload as any;
        req.userid = payload.id;

        next();
    });
});

router.post("/edit", async (req, res) => {
    const user = await User.findById(req.userid);
    if (req.body["username"] && req.body["username"] !== user?.username && (await User.countDocuments({ username: req.body["username"] }))) {
        return res.status(500).json("error");
    }

    await User.findByIdAndUpdate(req.userid, {
        displayName: req.body["displayName"] ? req.body["displayName"] : user?.displayName,
        username: req.body["username"] ? req.body["username"] : user?.username,
    });

    updateUser(io, req.userid, {
        displayName: req.body["displayName"] ? req.body["displayName"] : user?.displayName,
        username: req.body["username"] ? req.body["username"] : user?.username,
        status: socketByUserid.has(req.userid),
    });
    return res.status(200).json("success");
});

export default router;
