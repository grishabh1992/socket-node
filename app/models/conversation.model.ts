
import mongoose = require("mongoose");
import { UserModel } from "./user.model";
export interface ConversationModel extends mongoose.Document {
    members?: UserModel[] | string[];
    createdAt?: Date;
    _id?: string;
    isGroup?: boolean;
    groupName?: string;
}