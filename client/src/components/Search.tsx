import * as Form from "@radix-ui/react-form";

import { FormEvent, useRef, useState } from "react";

import axios from "axios";

function search(formData: FormData, setReceiverId: CallableFunction, setServerErrors: CallableFunction) {
    axios
        .get(`http://localhost:3000/userid/${formData.get("username")}`)
        .then((response) => {
            setReceiverId(response.data.id);
        })
        .catch(() => {
            setServerErrors({ username: true });
        });
}

function Search(props: { setReceiverId: CallableFunction }) {
    const [serverErrors, setServerErrors] = useState({ username: false });

    const searchInputRef = useRef<HTMLInputElement>(null);

    const onSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        search(formData, props.setReceiverId, setServerErrors);
        searchInputRef.current!.value = "";
    };

    return (
        <Form.Root className="w-full flex gap-2" onSubmit={onSearch}>
            <Form.Field name="username" serverInvalid={serverErrors.username}>
                <div className="text-left absolute top-[58px] text-sm text-slate-600">
                    <Form.Message match="valueMissing">Укажите имя пользователя</Form.Message>
                    <Form.Message match="patternMismatch">Неверный формат</Form.Message>
                    {serverErrors.username && (
                        <>
                            <Form.Message>Неверное имя пользователя</Form.Message>
                        </>
                    )}
                </div>
                <Form.Control asChild>
                    <input className="w-full h-full p-3 rounded-md border border-gray-500" ref={searchInputRef} onChange={() => setServerErrors({ username: false })} required type="text" pattern="[a-z0-9]+" placeholder="Поиск" />
                </Form.Control>
            </Form.Field>

            <Form.Submit asChild>
                <button className="p-3 flex justify-center items-center rounded-md border bg-slate-200" onClick={() => setServerErrors({ username: false })}>
                    🔎
                </button>
            </Form.Submit>
        </Form.Root>
    );
}

export default Search;
