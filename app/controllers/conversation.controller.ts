import { NextFunction, Response, Request } from "express";
import { ConversationRepository } from "../repositories/conversation.repository";
import { CumtomResponse } from "../config/response";
import { MongooseUtil } from "../utils/mongoose.util";

export class ConversationController {
    conversationRepository: ConversationRepository;
    mongooseUtil: MongooseUtil;
    constructor() {
        this.conversationRepository = new ConversationRepository();
        this.mongooseUtil = new MongooseUtil();
    }

    getRecord = async (request: Request, response: Response, next: NextFunction) => {
        try {
            let condition = {
                "members": { $in: [this.mongooseUtil.objectId(request['user']._id)] }
            };
            if (request.params.id) {
                condition["_id"] = request.params.id;
            }
            const conversations = await this.conversationRepository.aggregate([
                { $match: condition },
                {
                    $lookup: {
                        from: "messages",
                        let: {
                            conversation_id: "$_id"
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $ne: [this.mongooseUtil.objectId(request['user']._id), "$sender"] },
                                            { $eq: ["$$conversation_id", "$conversation"] },
                                        ]
                                    }
                                }
                            },
                            { $project: { isUnSeen: { $cond: [{ $in: [this.mongooseUtil.objectId(request['user']._id), "$seen"] }, 0, 1] }, "conversation": 1, _id: 0 } },
                            { $group: { _id: "$conversation", count: { $sum: "$isUnSeen" } } }
                        ],
                        as: "messageUnread"
                    }
                },
                { $project: { seenObject: { $arrayElemAt: ["$messageUnread", 0] }, "members": 1, "createdAt": 1, "isGroup": 1, groupName: 1 } },
                {
                    $lookup: {
                        from: "messages",
                        let: {
                            conversation_id: "$_id"
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$$conversation_id", "$conversation"] },
                                        ]
                                    }
                                }
                            },
                            { $sort: { _id: 1 } },
                            { $limit: 1 }

                        ],
                        as: "lastMessages"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "members",
                        foreignField: "_id",
                        as: "members"
                    }
                },
                { $project: { lastMessage: { $arrayElemAt: ["$lastMessages", 0] }, unreadCount: "$seenObject.count", "members": 1, "createdAt": 1, "isGroup": 1, groupName: 1 } },

            ]);
            response.send(CumtomResponse.success(conversations, 'Conversations fetched'));
        } catch (error) {
            throw CumtomResponse.serverError(error, 'Error');
        }
    }

    createRecord = async (request: Request, response: Response, next: NextFunction) => {
        try {
            let conversationBody = request.body;
            conversationBody.members.push(request['user']._id);
            const conversationAray = await this.conversationRepository.retrieve({ members: { "$all": conversationBody.members } });
            let conversation;
            if (conversationAray.length) {
                conversation = conversationAray[0];
            } else {
                conversation = await this.conversationRepository.create(request.body);
            }
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