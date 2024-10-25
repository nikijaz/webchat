import * as Form from "@radix-ui/react-form";

import { FormEvent, useState } from "react";

import { Link } from "react-router-dom";
import axios from "axios";
import useSignIn from "react-auth-kit/hooks/useSignIn";

function register(formData: FormData, auth: CallableFunction, setServerErrors: CallableFunction) {
    axios
        .post("http://localhost:3000/register", {
            displayName: formData.get("displayName"),
            username: formData.get("username"),
            password: formData.get("password"),
        })
        .then((response) => {
            auth({
                auth: {
                    token: response.data["token"],
                    type: "Bearer",
                },
                userState: response.data["id"],
            });
            window.location.href = "/";
        })
        .catch(() => setServerErrors({ username: true }));
}

function Register() {
    const [serverErrors, setServerErrors] = useState({ username: false });

    const auth = useSignIn();

    const onRegister = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        register(formData, auth, setServerErrors);
    };

    return (
        <Form.Root className="min-w-[425px] px-20 py-10 flex flex-col justify-center gap-5 text-center rounded-xl bg-white" onSubmit={onRegister}>
            <h1 className="font-bold text-3xl text-slate-600">Регистрация</h1>

            <div className="w-full flex flex-col justify-center gap-8">
                <Form.Field className="relative" name="displayName">
                    <div className="text-left absolute top-12 text-sm text-slate-600">
                        <Form.Message match="valueMissing">Укажите отображаемое имя</Form.Message>
                    </div>
                    <Form.Control asChild>
                        <input className="w-full p-3 border-b border-gray-500" required type="text" placeholder="Отображаемое имя" />
                    </Form.Control>
                </Form.Field>

                <Form.Field className="relative" name="username" serverInvalid={serverErrors.username}>
                    <div className="text-left absolute top-12 text-sm text-slate-600">
                        <Form.Message match="valueMissing">Укажите имя пользователя</Form.Message>
                        <Form.Message match="patternMismatch">Неверный формат</Form.Message>
                        {serverErrors.username && (
                            <>
                                <Form.Message>Указанное имя уже используется</Form.Message>
                            </>
                        )}
                    </div>
                    <Form.Control asChild>
                        <input className="w-full p-3 border-b border-gray-500" onChange={() => setServerErrors({ username: false })} required type="text" pattern="[a-z0-9]+" placeholder="Имя пользователя" />
                    </Form.Control>
                </Form.Field>

                <Form.Field className="relative" name="password">
                    <div className="absolute top-12 text-sm text-slate-600">
                        <Form.Message match="valueMissing">Укажите пароль</Form.Message>
                    </div>
                    <Form.Control asChild>
                        <input className="w-full p-3 border-b border-gray-500" required type="password" placeholder="Пароль" />
                    </Form.Control>
                </Form.Field>

                <Form.Submit asChild>
                    <button className="p-3 text-lg text-white bg-slate-600">Зарегистрироваться</button>
                </Form.Submit>
            </div>

            <p>
                Есть аккаунт?{" "}
                <Link className="text-slate-600" to="/login">
                    Войти
                </Link>
            </p>
        </Form.Root>
    );
}

export default Register;
