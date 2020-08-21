
import Mongoose = require("mongoose");
import DataAccess = require("../config/mongo.connector");
import { MessageModel } from "../models/message.model";
const mongooseConnection = DataAccess.mongooseConnection;

class MessageSchema {
    static get schema() {
        var schema = new Mongoose.Schema({
            createdAt: {
                type: Date,
                default: Date.now
            },
            conversation: {
                type: Mongoose.Schema.Types.ObjectId,
                ref: 'Conversations'
            },
            messageText: {
                type: String
            },
            members: [{
                type: Mongoose.Schema.Types.ObjectId,
                ref: 'Users'
            }],
            sender: {
                type: Mongoose.Schema.Types.ObjectId,
                ref: 'Users'
            },
            seen: [{
                type: Mongoose.Schema.Types.ObjectId,
                ref: 'Users'
            }],
        });
        return schema;
    }
}
export const MessageSchemaDO = mongooseConnection.model<MessageModel>("Messages", MessageSchema.schema);