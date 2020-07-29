import { RepositoryBase } from "../config/base.repository";
import { MessageSchemaDO } from "../schemas/message.schema";
import { MessageModel } from "../models/message.model";

export class MessageRepository extends RepositoryBase<MessageModel> {
    constructor() {
        super(MessageSchemaDO);
    }
}