import { io, type Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:4000';

let socketInstance: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket']
    });
  }

  return socketInstance;
};

export const connectSocket = (): Socket => {
  const socket = getSocket();

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

export const disconnectSocket = (): void => {
  socketInstance?.disconnect();
};

export const joinAssignmentRoom = (assignmentId: string): void => {
  getSocket().emit('join_assignment', assignmentId);
};

export const joinPaperRoom = (paperId: string): void => {
  getSocket().emit('join_paper', paperId);
};