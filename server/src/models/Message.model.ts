import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    when: {
        type: mongoose.Schema.Types.Date,
        required: true,
    },
    edited: {
        type: mongoose.Schema.Types.Boolean,
        required: true,
    },
    text: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
});
const Message = mongoose.model("Message", MessageSchema, "messages");

export default Message;
