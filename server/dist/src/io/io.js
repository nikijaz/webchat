"use strict";
io.engine.use((req, res, next) => {
    const isHandshake = req._query.sid === undefined;
    if (!isHandshake) {
        return next();
    }
    const header = req.headers["authorization"];
    if (!header) {
        return next(new Error("no token"));
    }
    if (!header.startsWith("bearer ")) {
        return next(new Error("invalid token"));
    }
    const token = header.substring(7);
    jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
        if (err) {
            return next(new Error("invalid token"));
        }
        req.user = decoded.data;
        next();
    });
});
io.on("connection", (socket) => {
    console.log('a user connected');
});
