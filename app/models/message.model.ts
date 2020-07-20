
import mongoose = require("mongoose");
import { UserModel } from "./user.model";
import { ConversationModel } from "./conversation.model";
export interface MessageModel extends mongoose.Document {
    sender?: UserModel | string;
    messageText?: string;
    createdAt?: Date;
    conversationId?: ConversationModel | string;
    members?: UserModel[] | string[];
    _id?: string;
}