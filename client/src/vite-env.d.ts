/// <reference types="vite/client" />

interface UserData {
    displayName: string;
    username: string;
    status: boolean;
}

interface Message {
    _id: string;
    from: string;
    to: string;
    when: Date;
    edited: boolean;
    text: string;
}
