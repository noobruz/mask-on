import { Socket } from "socket.io";

export type AuthPayload = {
    userID: string;
    name?: string;
  };
export type SocketWithAuth = Socket & AuthPayload;