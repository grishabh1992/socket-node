import { NextFunction, Response, Request } from "express";
import { ConversationRepository } from "../repositories/conversation.repository";
import { CumtomResponse } from "../config/response";

export class ConversationController {
    conversationRepository: ConversationRepository;
    constructor() {
        this.conversationRepository = new ConversationRepository();
    }

    getRecord = async (request: Request, response: Response, next: NextFunction) => {
        try {
            let condition = {
                // "members" : { $in : [req.user._id] }
            };
            if (request.params.id) {
                condition["_id"] = request.params.id;
            }
            const conversations = await this.conversationRepository.queryWithPopulation(condition, {}, {}, JSON.parse(request.query.ref as string));
            response.send(CumtomResponse.success(conversations, 'Conversations fetched'));
        } catch (error) {
            throw CumtomResponse.serverError(error, 'Error');
        }
    }

    createRecord = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const conversation = await this.conversationRepository.create(request.body);
            response.send(CumtomResponse.success(conversation, 'Conversation created'));
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