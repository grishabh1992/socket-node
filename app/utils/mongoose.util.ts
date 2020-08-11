import mongoose = require("mongoose");

export class MongooseUtil {
    objectId(id : string): mongoose.Schema.Types.ObjectId {
        return mongoose.Types.ObjectId(id);
    }
}