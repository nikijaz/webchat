import { Server } from "socket.io";
import cors from "cors";
import { createServer } from "http";
import dotenv from "dotenv";
import express from "express";
import handler from "./src/handlers/handler";
import mongoose from "mongoose";
import router from "./src/routes/router";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI!);
mongoose.Promise = global.Promise;
require("./src/models/User.model");
require("./src/models/Message.model");

const app = express();
const server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {},
    cors: { origin: "*" },
});

app.use(cors({ origin: "*" }));
app.use(express.json());

handler(io);
app.use(router);

server.listen(process.env.EXPRESS_PORT, () => {
    console.log(`http://localhost:${process.env.EXPRESS_PORT}`);
});

export { io };
