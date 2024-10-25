import * as ContextMenu from "@radix-ui/react-context-menu";

import { useEffect, useRef, useState } from "react";

import { Socket } from "socket.io-client";

function Message(props: { socket: Socket; message: Message; messageOwn: boolean; prevMessageOwn: boolean | null }) {
    const [className, setClassName] = useState("");
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        let className = "w-fit max-w-80 p-3 flex flex-col rounded-xl bg-slate-200";
        if (props.messageOwn) className += " ml-auto";
        if (props.prevMessageOwn !== null && props.messageOwn !== props.prevMessageOwn) className += " mt-4";
        setClassName(className);
    }, []);

    const onDelete = () => props.socket.emit("removeMessage", props.message.to, props.message._id);
    const onEdit = () => {
        textRef.current!.contentEditable = "true";
        setTimeout(() => textRef.current!.focus(), 1);

        const evaluate = () => {
            textRef.current!.contentEditable = "false";
            if (!textRef.current!.innerHTML) {
                textRef.current!.innerHTML = props.message.text;
            } else {
                props.socket.emit("editMessage", props.message.to, props.message._id, textRef.current!.innerHTML);
            }
            textRef.current!.removeEventListener("blur", onBlur);
            textRef.current!.removeEventListener("keypress", onKeypress);
        };

        const onBlur = evaluate;
        const onKeypress = (e: KeyboardEvent) => {
            if (e.key === "Enter") evaluate();
        };

        textRef.current!.addEventListener("blur", onBlur);
        textRef.current!.addEventListener("keypress", onKeypress);
    };

    if (props.messageOwn) {
        return (
            <div className={className}>
                <ContextMenu.Root>
                    <ContextMenu.Trigger>
                        <p ref={textRef}>{props.message.text}</p>
                        <div className="w-fit ml-auto flex justify-center items-center gap-1">
                            {props.message.edited && (
                                <>
                                    <img className="h-3" src="/pencil.svg" />
                                </>
                            )}
                            <p className="ml-auto text-xs text-gray-500">{props.message.when.toTimeString().split(" ")[0]}</p>
                        </div>
                    </ContextMenu.Trigger>
                    <ContextMenu.Portal>
                        <ContextMenu.Content className="message p-2 flex flex-col gap-2 rounded-md">
                            <ContextMenu.Item>
                                <button className="text-slate-600" onClick={onEdit}>
                                    Изменить
                                </button>
                            </ContextMenu.Item>
                            <hr />
                            <ContextMenu.Item>
                                <button className="text-slate-600" onClick={onDelete}>
                                    Удалить
                                </button>
                            </ContextMenu.Item>
                        </ContextMenu.Content>
                    </ContextMenu.Portal>
                </ContextMenu.Root>
            </div>
        );
    } else {
        return (
            <div className={className}>
                <p>{props.message.text}</p>
                <div className="w-fit ml-auto flex justify-center items-center gap-1">
                    {props.message.edited && (
                        <>
                            <img className="h-3" src="/pencil.svg" />
                        </>
                    )}
                    <p className="ml-auto text-xs text-gray-500">{props.message.when.toTimeString().split(" ")[0]}</p>
                </div>
            </div>
        );
    }
}

export default Message;
