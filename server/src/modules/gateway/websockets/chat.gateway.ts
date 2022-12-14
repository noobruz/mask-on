import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  WsResponse,
} from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Socket } from 'dgram';
import { Namespace, Server } from 'socket.io';
import { Room, SocketWithAuth } from 'src/common/types/types';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { WsCatchAllFilter } from '../exception/ws-catch-all.filter';
import { remove,keys } from 'lodash';

// @UseFilters(new WsCatchAllFilter())
// @UsePipes(new ValidationPipe())
@WebSocketGateway({
  namespace: 'chats',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);
  private rooms: Map<string, Room>;
  private users: Array<User>;
  private usersInRoom: Array<User>;
  @WebSocketServer() io: Namespace;
  constructor() {
    this.rooms = new Map();
    this.users = [];
    this.usersInRoom = [];
  }
  afterInit(server: any) {
    this.logger.log('Initialized Gateway Successfully');
  }
  handleConnection(socket: SocketWithAuth) {
    this.logger.log('User logged in ' + socket.user.id);
    this.users.push({
      id: socket.user.id,
      username: socket.user.username,
    });
  }
  handleDisconnect(socket: SocketWithAuth) {
    this.users = remove(this.users, socket.user);
    if (this.usersInRoom.includes(socket.user)) {
      const key = keys(this.rooms).filter((key) => {
        const room = this.rooms.get(key);
        if (room.client == socket.user || room.host == socket.user) {
          return true;
        }
        return false;
      })[0];
      this.rooms.delete(key);
      this.usersInRoom = remove(this.usersInRoom, socket.user);
    }
    this.logger.log('Handle Logout');
  }

  @SubscribeMessage('joinOrHost')
  createOrJoinRoom(socket: SocketWithAuth): WsResponse<unknown> {
    if (this.usersInRoom.includes(socket.user)) {
      return;
    }
    const roomKeys = [...this.rooms.keys()];
    const emptyRoomKeys = roomKeys.filter(
      (key) => this.rooms.get(key).inUse == false,
    );
    if (emptyRoomKeys.length > 0) {
      const key = emptyRoomKeys[0];
      const room = this.rooms.get(key);
      room.client = socket.user;
      room.inUse = true;
      socket.join(room.id);
      socket.in(room.id).emit('roomJoined', { event: 'client joined', room });
      this.rooms.set(key, room);
      this.usersInRoom.push(socket.user); this.usersInRoom.push(socket.user);
      return { data: room, event: 'roomJoined' };
    }
    const room: Room = {
      id: socket.user.id,
      inUse: false,
      host: socket.user,
    };

    this.rooms.set(`${room.id}`, room);
    this.usersInRoom.push(socket.user);
    socket.join(room.id);
    return { data: room, event: 'roomJoined' };
  }

  @SubscribeMessage('chat')
  chat(socket: SocketWithAuth, data: { room: string; message: any }) {
    socket.in(data.room).emit('chat', data.message);
  }
}
