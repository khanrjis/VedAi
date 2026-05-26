import type { Server as HttpServer } from 'node:http';
import { Server as SocketIOServer, type Socket } from 'socket.io';
import { env } from '../config/env.js';

export const createSocketServer = (httpServer: HttpServer): SocketIOServer => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true
    }
  });

  io.on('connection', (socket: Socket) => {
    socket.on('join_assignment', (assignmentId: string) => {
      socket.join(`assignment:${assignmentId}`);
    });

    socket.on('join_paper', (paperId: string) => {
      socket.join(`paper:${paperId}`);
    });
  });

  return io;
};

export const emitToAssignment = (io: SocketIOServer | null, assignmentId: string, event: string, payload: unknown): void => {
  io?.to(`assignment:${assignmentId}`).emit(event, payload);
};

export const emitToPaper = (io: SocketIOServer | null, paperId: string, event: string, payload: unknown): void => {
  io?.to(`paper:${paperId}`).emit(event, payload);
};