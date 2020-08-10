import { NextFunction, Response, Request } from "express";
import { CumtomResponse } from "../config/response";
import { MessageRepository } from "../repositories/message.repository";
import { ConversationRepository } from "../repositories/conversation.repository";

export class MessageController {
    messageRepository: MessageRepository;
    conversationRepository : ConversationRepository;
    constructor() {
        this.messageRepository = new MessageRepository();
        this.conversationRepository = new ConversationRepository()
    }

    getRecord = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const aggregatePipeline = [
                { $match: request.params.conversationId ? { conversation: request.params.conversationId } : {} },
                { $group: { _id: "$conversation", messages: { $push: "$$ROOT" } } },
                {
                    $lookup: {
                        from: "conversations",
                        localField: "_id",
                        foreignField: "_id",
                        as: "conversation"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "conversation.members",
                        foreignField: "_id",
                        as: "members"
                    }
                },
                { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$conversation", 0] }, "$$ROOT"] } } },
                { $project: { conversation: 0, "messages.members": 0, "messages.conversation": 0 } }
            ];
            let conversationMessages = await this.messageRepository.aggregate(aggregatePipeline);
            if(conversationMessages  && Array.isArray(conversationMessages)){
                const condition = {};
                if (request.params.conversationId) {
                    condition["_id"] = request.params.conversationId;
                }
                conversationMessages = await this.conversationRepository.queryWithPopulation(condition, {}, {}, ['members']);
            }
            response.send(CumtomResponse.success(conversationMessages, 'Conversations Messages fetched'));
        } catch (error) {
            throw CumtomResponse.serverError(error, 'Error');
        }
    }

    createRecord = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const message = await this.messageRepository.create(request.body);
            response.send(CumtomResponse.success(message, 'Message created'));
        } catch (error) {
            throw CumtomResponse.serverError(error, 'Error');
        }
    }

    updateRecord = async (request: Request, response: Response, next: NextFunction) => {
        response.json(request.body);
    }

    deleteRecord = async (request: Request, response: Response, next: NextFunction) => {
        response.send(request.params.id + ' deleted successfully');
    }
}