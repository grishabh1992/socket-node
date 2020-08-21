import { AuthUtil } from "../utils/auth.util";
import { MessageRepository } from "../repositories/message.repository";
import { MessageModel } from "../models/message.model";

const io = require('socket.io')();
export const SocketConf: any = {};
export class Socket {
    private auth: AuthUtil;
    private messageRepository: MessageRepository;
    constructor() {
        this.auth = new AuthUtil();
        this.messageRepository = new MessageRepository();
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
        SocketConf.io.on('connect', socket => {
            console.log('Client Connectted');
            socket.join(socket.handshake.query.loggedUser._id);
            socket.on('join', room => {
                socket.join(room.roomName);
                io.to(room.roomName).emit('New User Connected...');
            });

            socket.on('message', async (messageObject: MessageModel) => {
                const message = await this.messageRepository.create(messageObject);
                io.to(messageObject.conversation!).emit('message', message);
                // if (io.sockets.adapter.rooms[conversation]) {
                //     console.log(io.sockets.adapter.rooms[conversation].length, 'no of client in room===========');
                // }
                console.log(messageObject, 'messageObject');
                messageObject.members.filter(user => user._id !== messageObject.sender).forEach(user => {
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
            socket.on('disconnect', function () {
                console.log('disconnected event');
                //socket.manager.onClientDisconnect(socket.id); --> endless loop with this disconnect event on server side
                //socket.disconnect(); --> same here
              });
        });
        // Added Disconnection FUnction of socket
        // Remove client from all joined roomes once socket is disconnected
    }
}