import "socket.io";

declare global {
    namespace Express {
        interface Request {
            userid: string;
        }
    }

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
}

declare module "socket.io" {
    interface Socket {
        userid: string;
    }
}
