import { AuthUtil } from "../utils/auth.util";

const io = require('socket.io')();
export const SocketConf: any = {};
export class Socket {
    private auth: AuthUtil;
    constructor() {
        this.auth = new AuthUtil();
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
                let token = this.auth.authenticate(socket.handshake.query.token);
                if (token) {
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
                console.log('Client join', room);
                socket.join(room.roomName);
                io.to(room.roomName).emit('New User Connected...');
            });
        });
    }
}