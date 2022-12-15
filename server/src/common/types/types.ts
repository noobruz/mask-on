import { User } from "@prisma/client";
import { Socket } from "socket.io";

export type AuthPayload = {
    user:User
  };
export type SocketWithAuth = Socket & AuthPayload;

export type Room = {
  inUse:boolean
  host:User,
  client?:User,
  id:string
}