import { Server } from "socket.io";
import authHandler from "./auth.handler";
import { handler as eventHandler } from "./event.handler";

const handler = (io: Server) => {
    authHandler(io);
    eventHandler(io);
};

export default handler;
