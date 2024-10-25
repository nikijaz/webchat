import * as Form from "@radix-ui/react-form";

import { FormEvent, useState } from "react";
import axios, { AxiosError } from "axios";

import { Link } from "react-router-dom";
import useSignIn from "react-auth-kit/hooks/useSignIn";

function login(formData: FormData, auth: CallableFunction, setServerErrors: CallableFunction) {
    axios
        .post("http://localhost:3000/login", {
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
        .catch((error: AxiosError) => {
            const key = error.response?.data as string;
            setServerErrors({ username: false, password: false });
            setServerErrors((s: { username: boolean; password: boolean }) => {
                return { ...s, [key]: true };
            });
        });
}

function Login() {
    const [serverErrors, setServerErrors] = useState({ username: false, password: false });

    const auth = useSignIn();

    const onLogin = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        login(formData, auth, setServerErrors);
    };

    return (
        <Form.Root className="min-w-[425px] px-20 py-10 flex flex-col justify-center gap-5 text-center rounded-xl bg-white" onSubmit={onLogin}>
            <h1 className="font-bold text-3xl text-slate-600">Авторизация</h1>

            <div className="w-full flex flex-col justify-center gap-8">
                <Form.Field className="relative" name="username" serverInvalid={serverErrors.username}>
                    <div className="text-left absolute top-12 text-sm text-slate-600">
                        <Form.Message match="valueMissing">Укажите имя пользователя</Form.Message>
                        <Form.Message match="patternMismatch">Неверный формат</Form.Message>
                        {serverErrors.username && (
                            <>
                                <Form.Message>Неверное имя пользователя</Form.Message>
                            </>
                        )}
                    </div>
                    <Form.Control asChild>
                        <input className="w-full p-3 border-b border-gray-500" onChange={() => setServerErrors({ ...serverErrors, username: false })} required type="text" pattern="[a-z0-9]+" placeholder="Имя пользователя" />
                    </Form.Control>
                </Form.Field>

                <Form.Field className="relative" name="password" serverInvalid={serverErrors.password}>
                    <div className="absolute top-12 text-sm text-slate-600">
                        <Form.Message match="valueMissing">Укажите пароль</Form.Message>
                        {serverErrors.password && (
                            <>
                                <Form.Message>Неверный пароль</Form.Message>
                            </>
                        )}
                    </div>
                    <Form.Control asChild>
                        <input className="w-full p-3 border-b border-gray-500" onChange={() => setServerErrors({ ...serverErrors, password: false })} required type="password" placeholder="Пароль" />
                    </Form.Control>
                </Form.Field>

                <Form.Submit asChild>
                    <button className="p-3 text-lg text-white bg-slate-600">Войти</button>
                </Form.Submit>
            </div>

            <p>
                Нет аккаунта?{" "}
                <Link className="text-slate-600" to="/register">
                    Зарегистрироваться
                </Link>
            </p>
        </Form.Root>
    );
}

export default Login;
