import { AuthUtil } from "../utils/auth.util";
import { MessageRepository } from "../repositories/message.repository";
import { MessageModel } from "../models/message.model";
import { UserRepository } from "../repositories/user.repository";
import { UserModel } from "../models/user.model";

const io = require('socket.io')();
export const SocketConf: any = {};
export class Socket {
    private auth: AuthUtil;
    private messageRepository: MessageRepository;
    private userRepository: UserRepository;
    constructor() {
        this.auth = new AuthUtil();
        this.messageRepository = new MessageRepository();
        this.userRepository = new UserRepository();
    }
    init(server) {
        SocketConf.io = io.listen(server, {
            log: true
        });
        this.setupEvent();
    }

    setupEvent() {
        SocketConf.io.use((socket, next) => {
            console.log(socket.handshake.query, 'socket.handshake.query');
            if (socket.handshake.query) {
                let user = this.auth.authenticate(socket.handshake.query.token);
                if (user) {
                    socket.handshake.query.loggedUser = user;
                    next();
                } else {
                    next(new Error('Authentication error'));
                }
            }
            else {
                next(new Error('Authentication error'));
            }
        })
        SocketConf.io.on('connect', async (socket) => {
            console.log('Client Connectted');
            socket.join(socket.handshake.query.loggedUser._id);
            await this.userRepository.updateWithoutSet(
                {
                    "_id": { "$eq": socket.handshake.query.loggedUser._id },
                }, { "$addToSet": { sockets: socket.id } }, {}
            );

            socket.on('join', async (room) => {
                socket.join(room.roomName);
                io.to(room.roomName).emit();
            });

            socket.on('message', async (messageObject: MessageModel) => {
                const message = await this.messageRepository.create(messageObject);
                io.to(messageObject.conversation!).emit('message', message);
                ((messageObject.members as Array<UserModel>).filter(user => user._id !== messageObject.sender)).forEach(user => {
                    if (io.sockets.adapter.rooms[user._id] && io.sockets.adapter.rooms[user._id].length) {
                        io.to(user._id).emit('unseen-message', message);
                    }
                });
            });

            socket.on('typing', async (conversation: string) => {
                io.to(conversation!).emit('typing', conversation, socket.handshake.query.loggedUser);
            });

            socket.on('seen', async (conversation: string, date: Date) => {
                await this.messageRepository.updateWithoutSet(
                    {
                        "sender": { "$ne": socket.handshake.query.loggedUser._id },
                        "conversation": conversation,
                        "createdAt": { $lte: new Date(date).toISOString() }
                    }, { "$addToSet": { seen: socket.handshake.query.loggedUser._id } }, { multi: true }
                );
            });
            socket.on('disconnect', async () => {
                console.log('Disconnected socket');
                await this.userRepository.updateWithoutSet(
                    {
                        "_id": { "$eq": socket.handshake.query.loggedUser._id },
                    }, { "$pull": { sockets: socket.id } }, { multi: true }
                );
            });
        });
    }
}