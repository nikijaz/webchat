import jwt from "jsonwebtoken";

function generateToken(payload: object) {
    return jwt.sign(payload, process.env.JWT_TOKEN as string, { expiresIn: process.env.JWT_EXPIRES_IN });
}

export { generateToken };
