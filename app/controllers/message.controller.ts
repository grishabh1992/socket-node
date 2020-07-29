import { NextFunction, Response, Request } from "express";
import { CumtomResponse } from "../config/response";
import { MessageRepository } from "../repositories/message.repository";

export class MessageController {
    messageRepository: MessageRepository;
    constructor() {
        this.messageRepository = new MessageRepository();
    }

    getRecord = async (request: Request, response: Response, next: NextFunction) => {
        try {
            let condition = {};
            console.log(JSON.parse(request.query.ref as string));
            const conversationMessages = await this.messageRepository.queryWithPopulation(condition, {}, {}, JSON.parse(request.query.ref as string));
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