import { RepositoryBase } from "../config/base.repository";
import { ConversationModel } from "../models/conversation.model";
import { ConversationSchemaDO } from "../schemas/conversation.schema";

export class ConversationRepository extends RepositoryBase<ConversationModel> {
    constructor() {
        super(ConversationSchemaDO);
    }
}