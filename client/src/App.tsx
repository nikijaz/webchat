import { BrowserRouter, Route, Routes } from "react-router-dom";

import AuthProvider from "react-auth-kit/AuthProvider";
import Login from "./pages/Login";
import Main from "./pages/Main";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import RequireAuth from "@auth-kit/react-router/RequireAuth";
import createStore from "react-auth-kit/createStore";

const store = createStore({
    authName: "_auth",
    authType: "cookie",
    cookieDomain: window.location.hostname,
    cookieSecure: window.location.protocol === "https:",
});

function App() {
    return (
        <>
            <div className="w-screen h-screen flex justify-center items-center bg-slate-600">
                <AuthProvider store={store}>
                    <BrowserRouter>
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <RequireAuth fallbackPath={"/login"}>
                                        <Main></Main>
                                    </RequireAuth>
                                }
                            />
                            <Route path="login" element={<Login></Login>} />
                            <Route path="register" element={<Register></Register>} />
                            <Route path="*" element={<NotFound></NotFound>} />
                        </Routes>
                    </BrowserRouter>
                </AuthProvider>
            </div>
        </>
    );
}

export default App;
