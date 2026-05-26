import { Server as SocketIOServer } from 'socket.io';
import { env } from '../config/env.js';
export const createSocketServer = (httpServer) => {
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: env.CLIENT_URL,
            credentials: true
        }
    });
    io.on('connection', (socket) => {
        socket.on('join_assignment', (assignmentId) => {
            socket.join(`assignment:${assignmentId}`);
        });
        socket.on('join_paper', (paperId) => {
            socket.join(`paper:${paperId}`);
        });
    });
    return io;
};
export const emitToAssignment = (io, assignmentId, event, payload) => {
    io?.to(`assignment:${assignmentId}`).emit(event, payload);
};
export const emitToPaper = (io, paperId, event, payload) => {
    io?.to(`paper:${paperId}`).emit(event, payload);
};
