import { Socket, io } from "socket.io-client";
import { useEffect, useState } from "react";

import Chat from "../components/Chat";
import ChatList from "../components/ChatList";
import Search from "../components/Search";
import Settings from "../components/Settings";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

function Main() {
    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [userDataMap, setUserDataMap] = useState<Map<string, UserData>>(new Map());
    const [receiver, setReceiver] = useState<string>();

    const userId = useAuthUser() as string;

    const authHeader = useAuthHeader();

    useEffect(() => {
        setSocket(io("ws://localhost:3000/", { auth: { header: authHeader as string } }));

        return () => {
            if (socket) {
                socket.off();
            }
        };
    }, []);
    useEffect(() => {
        if (!socket) {
            return;
        }

        socket.on("data", (data: string) => {
            setUserDataMap((u) => new Map<string, UserData>([...u, ...JSON.parse(data)]));
        });

        socket.on("addMessages", (reset: boolean, messages: Message[]) => {
            if (reset) setMessages([]);
            setMessages((m) => [
                ...m,
                ...messages.map((entry) => {
                    return { ...entry, when: new Date(entry.when) };
                }),
            ]);
        });

        socket.on("removeMessages", (data) => {
            const messageIds = new Set<string>(JSON.parse(data));
            setMessages((messages) => messages.filter((message) => !messageIds.has(message._id)));
        });

        socket.on("editMessages", (data: string) => {
            const textByMessageId = new Map<string, string>(JSON.parse(data));
            setMessages((messages) =>
                messages.map((message) => {
                    if (textByMessageId.has(message._id)) {
                        message.edited = true;
                        message.text = textByMessageId.get(message._id)!;
                    }
                    return message;
                })
            );
        });
    }, [socket]);

    return (
        <div className="main w-3/4 h-4/5 flex rounded-xl">
            <div className="w-1/3 h-full flex flex-col rounded-l-xl border-r border-gray-500 bg-slate-100">
                <div className="w-full h-20 p-5 flex justify-between gap-5 border-b border-gray-500">
                    {userDataMap.has(userId) && (
                        <>
                            <div className="w-full h-full gap-5 hidden lg:flex">
                                <Settings userId={userId} userDataMap={userDataMap}></Settings>
                                <div className="h-full flex flex-col justify-center">
                                    <p className="leading-4">{userDataMap.get(userId)!.displayName}</p>
                                    <p className="font-thin text-sm leading-4">@{userDataMap.get(userId)!.username}</p>
                                </div>
                            </div>
                        </>
                    )}
                    <Search setReceiverId={setReceiver}></Search>
                </div>
                <div className="h-full overflow-y-auto">
                    <ChatList userDataMap={userDataMap} senderId={userId} messages={messages} receiverId={receiver} setReceiverId={setReceiver}></ChatList>
                </div>
            </div>
            <div className="w-2/3 h-full">{receiver ? <Chat userDataMap={userDataMap} socket={socket!} receiverId={receiver} messages={messages}></Chat> : ""}</div>
        </div>
    );
}

export default Main;
