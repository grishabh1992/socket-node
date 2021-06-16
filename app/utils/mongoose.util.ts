import { Types } from 'mongoose';

export class MongooseUtil {
    objectId(id: string): Types.ObjectId {
        return Types.ObjectId(id);
    }
}