import * as Form from "@radix-ui/react-form";

import { FormEvent, ReactElement, useEffect, useRef, useState } from "react";

import Message from "./Message";
import { Socket } from "socket.io-client";

function Chat(props: { socket: Socket; receiverId: string; messages: Message[]; userDataMap: Map<string, UserData> }) {
    const [messageElements, setMessageElements] = useState<ReactElement[]>();

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const messageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMessageElements(
            props.messages
                .filter((message) => props.receiverId === message.from || props.receiverId === message.to)
                .sort((a, b) => a.when.getTime() - b.when.getTime())
                .map((message, index, messages) => {
                    const messageOwn = message.to === props.receiverId;
                    const prevMessageOwn = index !== 0 ? messages[index - 1].to === props.receiverId : null;
                    return <Message socket={props.socket} message={message} messageOwn={messageOwn} prevMessageOwn={prevMessageOwn} key={message._id}></Message>;
                })
        );
    }, [props.receiverId, props.messages]);

    useEffect(() => {
        setTimeout(() => chatContainerRef.current!.scrollTo({ top: chatContainerRef.current!.scrollHeight, behavior: "smooth" }), 1);
    }, [props.messages]);
    useEffect(() => {
        setTimeout(() => chatContainerRef.current!.scrollTo({ top: chatContainerRef.current!.scrollHeight, behavior: "instant" }), 1);
    }, [props.receiverId]);

    const onSendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        props.socket.emit("addMessage", props.receiverId, formData.get("text"));
        messageInputRef.current!.value = "";
    };

    return (
        <>
            <div className="w-full h-20 p-5 flex gap-5 border-b border-gray-500">
                {props.userDataMap.has(props.receiverId) && (
                    <>
                        <div className="relative">
                            <img className="h-full" src={`https://api.multiavatar.com/${props.userDataMap.get(props.receiverId)!.username}.svg`} />
                            {props.userDataMap.get(props.receiverId)!.status && (
                                <>
                                    <img className="absolute right-0 bottom-0 rounded-full border-2 border-white" width={12} src="/green_circle.svg" />
                                </>
                            )}
                        </div>

                        <div className="h-full flex flex-col justify-center">
                            <p className="leading-4">{props.userDataMap.get(props.receiverId)!.displayName}</p>
                            <p className="font-thin text-sm leading-4">@{props.userDataMap.get(props.receiverId)!.username}</p>
                        </div>
                    </>
                )}
            </div>
            <div className="w-full h-[calc(100%-10rem)] p-5 flex flex-col gap-y-1 overflow-y-auto" ref={chatContainerRef}>
                {messageElements}
            </div>
            <div className="w-full h-20 p-5 flex gap-5 border-t border-gray-500">
                <Form.Root className="w-full h-full flex gap-5" onSubmit={(e) => onSendMessage(e)}>
                    <Form.Field className="w-full h-full relative" name="text">
                        <div className="absolute top-[38px] text-sm text-slate-800">
                            <Form.Message match="valueMissing">Укажите текст сообщения</Form.Message>
                        </div>
                        <Form.Control className="w-full h-full" asChild>
                            <input className="h-full p-3 rounded-md border border-gray-500" ref={messageInputRef} required type="text" placeholder="Сообщение" />
                        </Form.Control>
                    </Form.Field>

                    <Form.Submit asChild>
                        <button className="p-3 flex justify-center items-center rounded-md border bg-slate-200">Отправить</button>
                    </Form.Submit>
                </Form.Root>
            </div>
        </>
    );
}

export default Chat;
