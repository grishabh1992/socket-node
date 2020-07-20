import { NextFunction, Response, Request } from "express";
import { ConversationRepository } from "../repositories/conversation.repository";

export class ConversationController {
    conversationRepository: ConversationRepository;
    constructor() {
        this.conversationRepository = new ConversationRepository();
    }

    getRecord = async (request: Request, response: Response, next: NextFunction) => {
        await this.conversationRepository.getRecord();
        response.send('Get Response');
    }

    createRecord = async (request: Request, response: Response, next: NextFunction) => {
        response.json(request.body);
    }

    updateRecord = async (request: Request, response: Response, next: NextFunction) => {
        response.json(request.body);
    }

    deleteRecord = async (request: Request, response: Response, next: NextFunction) => {
        response.send(request.params.id + ' deleted successfully');
    }
}