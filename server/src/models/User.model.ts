import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    displayName: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    username: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
});
const User = mongoose.model("User", UserSchema, "users");

export default User;
