import { AuthUtil } from "../utils/auth.util";
import { MessageRepository } from "../repositories/message.repository";
import { MessageModel } from "../models/message.model";

const io = require('socket.io')();
export const SocketConf: any = {};
export class Socket {
    private auth: AuthUtil;
    private messageRepository : MessageRepository;
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

            socket.on('join', room => {
                socket.join(room.roomName);
                io.to(room.roomName).emit('New User Connected...');
            });

            socket.on('message', async (messageObject : MessageModel) => {
                const message = await this.messageRepository.create(messageObject);
                io.to(messageObject.conversation!).emit('message', message);
            });

            socket.on('typing', async (conversation : string) => {
                io.to(conversation!).emit('typing',  socket.handshake.query.loggedUser);
            });
        });
    }
}