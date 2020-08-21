
import Mongoose = require("mongoose");
import DataAccess = require("../config/mongo.connector");
import { ConversationModel } from "../models/conversation.model";
const mongooseConnection = DataAccess.mongooseConnection;

class ConversationSchema {
    static get schema() {
        var schema = new Mongoose.Schema({
            createdAt: {
                type: Date,
                default: Date.now
            },
            isGroup: {
                type: Boolean,
                default: false
            },
            groupName: {
                type: String
            },
            members: [{
                type: Mongoose.Schema.Types.ObjectId,
                ref: 'Users'
            }],
        });
        return schema;
    }
}
export const ConversationSchemaDO = mongooseConnection.model<ConversationModel>("Conversations", ConversationSchema.schema);