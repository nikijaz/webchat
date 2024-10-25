import { ReactElement, useEffect, useState } from "react";

function ChatList(props: { messages: Message[]; senderId: string; receiverId?: string; setReceiverId: CallableFunction; userDataMap: Map<string, UserData> }) {
    const [chatElements, setChatElements] = useState<ReactElement[]>();

    useEffect(() => {
        const usernames = new Set();

        Promise.all(
            props.messages
                .sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime())
                .filter((message) => {
                    for (let source of ["from", "to"] as (keyof Message)[]) {
                        if (message[source] !== props.senderId) {
                            const result = !usernames.has(message[source]);
                            usernames.add(message[source]);
                            return result;
                        }
                    }
                })
                .map(async (message) => {
                    const userId = message.from !== props.senderId ? message.from : message.to;
                    const userData = props.userDataMap.get(userId);
                    if (!userData) return <></>;

                    let className = "w-full h-20 p-5 flex gap-5 border-b border-gray-500";
                    if (userId === props.receiverId) className += " bg-slate-300";

                    return (
                        <div className={className} onClick={() => props.setReceiverId(userId)} key={userData.username}>
                            <div className="relative">
                                <img className="h-full" src={`https://api.multiavatar.com/${userData.username}.svg`} />
                                {userData.status && (
                                    <>
                                        <img className="absolute right-0 bottom-0 rounded-full border-2 border-white" width={12} src="/green_circle.svg" />
                                    </>
                                )}
                            </div>
                            <div className="h-full flex flex-col justify-center">
                                <p className="leading-4">{userData.displayName}</p>
                                <p className="leading-4 font-thin text-sm">{message.text.length > 16 ? `${message.text.slice(0, 16)}...` : message.text}</p>
                            </div>
                        </div>
                    );
                })
        ).then((result) => {
            setChatElements(result);
        });
    }, [props.messages, props.receiverId, props.userDataMap]);

    return chatElements;
}

export default ChatList;
