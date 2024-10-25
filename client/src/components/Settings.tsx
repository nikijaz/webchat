import * as Dialog from "@radix-ui/react-dialog";
import * as Form from "@radix-ui/react-form";

import { FormEvent, useState } from "react";

import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useSignOut from "react-auth-kit/hooks/useSignOut";

function edit(formData: FormData, authHeader: string, setOpen: CallableFunction, setServerErrors: CallableFunction) {
    axios
        .post(
            "http://localhost:3000/edit",
            {
                displayName: formData.get("displayName"),
                username: formData.get("username"),
            },
            {
                headers: {
                    Authorization: authHeader,
                },
            }
        )
        .then(() => {
            setOpen(false);
        })
        .catch(() => {
            setServerErrors({ username: true });
        });
}

function Settings(props: { userId: string; userDataMap: Map<string, UserData> }) {
    const [open, setOpen] = useState(false);
    const [serverErrors, setServerErrors] = useState({ username: false });

    const authHeader = useAuthHeader();
    const logOut = useSignOut();

    function onEdit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        edit(formData, authHeader!, setOpen, setServerErrors);
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>
                <img className="h-full" src={`https://api.multiavatar.com/${props.userDataMap.get(props.userId)!.username}.svg`} />
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="overlay fixed inset-0"></Dialog.Overlay>
                <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] min-w-[425px] px-20 py-10 rounded-xl bg-white">
                    <Form.Root className="w-full flex flex-col justify-center gap-8 text-center" onSubmit={onEdit}>
                        <Form.Field className="relative" name="displayName">
                            <Form.Label className="flex text-slate-600">Отображаемое имя</Form.Label>
                            <div className="text-left absolute top-[72px] text-sm text-slate-600 font-light">
                                <Form.Message match="valueMissing">Укажите отображаемое имя</Form.Message>
                            </div>
                            <Form.Control asChild>
                                <input className="w-full p-3 border-b border-gray-500" defaultValue={props.userDataMap.get(props.userId)!.displayName} required type="text" />
                            </Form.Control>
                        </Form.Field>

                        <Form.Field className="relative" name="username" serverInvalid={serverErrors.username}>
                            <Form.Label className="flex text-slate-600">Имя пользователя</Form.Label>
                            <div className="text-left absolute top-[72px] text-sm text-slate-600 font-light">
                                <Form.Message match="valueMissing">Укажите имя пользователя</Form.Message>
                                <Form.Message match="patternMismatch">Неверный формат</Form.Message>
                                {serverErrors.username && (
                                    <>
                                        <Form.Message>Указанное имя уже используется</Form.Message>
                                    </>
                                )}
                            </div>
                            <Form.Control asChild>
                                <input className="w-full p-3 border-b border-gray-500" onChange={() => setServerErrors({ username: false })} defaultValue={props.userDataMap.get(props.userId)!.username} required type="text" pattern="[a-z0-9]+" />
                            </Form.Control>
                        </Form.Field>

                        <Form.Submit asChild>
                            <button className="p-3 text-lg text-slate-600 bg-white border-2 border-slate-600">Подтвердить</button>
                        </Form.Submit>
                        <hr className="border-slate-600" />
                        <button
                            className="p-3 text-lg text-red-600 bg-white border-2 border-red-600"
                            onClick={() => {
                                logOut();
                                window.location.href = "/login";
                            }}
                        >
                            Выйти
                        </button>
                    </Form.Root>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export default Settings;
