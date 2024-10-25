import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const handler = (io: Server) => {
    io.use((socket, next) => {
        const header: string | undefined = socket.handshake.auth.header;
        if (!header || !header.startsWith("Bearer ")) {
            return next(new Error());
        }

        const token = header.substring(7);
        jwt.verify(token, process.env.JWT_TOKEN as string, () => {
            const payload: { id: string } = jwt.decode(token, { complete: true })?.payload as any;
            socket.userid = payload.id;

            next();
        });
    });
};

export default handler;
