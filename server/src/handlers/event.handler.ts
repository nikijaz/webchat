import { Server, Socket } from "socket.io";

import Message from "../models/Message.model";
import User from "../models/User.model";

const socketByUserid = new Map<string, Socket>();

function updateUser(io: Server, userId: string, userData: UserData) {
    io.sockets.emit("data", JSON.stringify(Array.from(new Map<string, UserData>([[userId, userData]]))));
}

function updateStatus(io: Server, userid: string) {
    User.findById(userid).then((user) => {
        io.sockets.emit(
            "data",
            JSON.stringify(
                Array.from(
                    new Map<string, UserData>([
                        [
                            userid,
                            {
                                displayName: user!.displayName,
                                username: user!.username,
                                status: socketByUserid.has(userid),
                            } as UserData,
                        ],
                    ])
                )
            )
        );
    });
}

const handler = (io: Server) => {
    io.on("connection", (socket) => {
        socketByUserid.set(socket.userid, socket);
        updateStatus(io, socket.userid);

        User.find().then((users) => {
            const userDataMap = new Map<string, UserData>();
            users.forEach((user) => {
                userDataMap.set(user.id, {
                    displayName: user.displayName,
                    username: user.username,
                    status: socketByUserid.has(user.id),
                });
            });
            socket.emit("data", JSON.stringify(Array.from(userDataMap)));
        });
        Message.find()
            .or([{ from: socket.userid }, { to: socket.userid }])
            .then((messages) => socket.emit("addMessages", true, messages));

        socket.on("addMessage", async (to: string, text: string) => {
            const message = {
                from: socket.userid,
                to: to,
                when: new Date(),
                edited: false,
                text: text,
            };
            const result = await Message.create(message);
            (message as Message)._id = result.id;

            socket.emit("addMessages", false, [message]);
            socketByUserid.get(to)?.emit("addMessages", false, [message]);
        });

        socket.on("removeMessage", async (to: string, id: string) => {
            await Message.findByIdAndDelete(id);
            const messageIds = new Set([id]);

            socket.emit("removeMessages", JSON.stringify(Array.from(messageIds)));
            socketByUserid.get(to)?.emit("removeMessages", JSON.stringify(Array.from(messageIds)));
        });

        socket.on("editMessage", async (to: string, id: string, text: string) => {
            await Message.findByIdAndUpdate(id, { edited: true, text: text });
            const textByMessageId = new Map([[id, text]]);

            socket.emit("editMessages", JSON.stringify(Array.from(textByMessageId)));
            socketByUserid.get(to)?.emit("editMessages", JSON.stringify(Array.from(textByMessageId)));
        });

        socket.on("disconnect", () => {
            socketByUserid.delete(socket.userid);
            updateStatus(io, socket.userid);
        });
    });
};

export { handler, socketByUserid, updateUser };
