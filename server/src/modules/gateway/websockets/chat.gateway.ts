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
import { Namespace } from 'socket.io';
import { Room, SocketWithAuth, UsersInRoom } from 'src/common/types/types';


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
  private usersInRoom: Array<UsersInRoom>;
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
    this.users = this.users.filter((user) => user.id !== socket.user.id);
    console.log(this.usersInRoom);
    const userInRoom = this.usersInRoom.find(
      (userInRoom) => userInRoom.user.id == socket.user.id,
    );
    if (userInRoom) {
      this.usersInRoom = this.usersInRoom.filter(
        (room) => room.user.id !== socket.user.id,
      );
      const room = this.rooms.get(userInRoom.roomId);
      if (userInRoom.isHost) {
        this.rooms.delete(userInRoom.roomId);
      }
    }
    this.logger.log('Handle Logout');
  }

  @SubscribeMessage('joinOrHost')
  createOrJoinRoom(socket: SocketWithAuth): WsResponse<unknown> {
    if (
      this.usersInRoom.find(
        (userInRoom) => userInRoom.user.id == socket.user.id,
      )
    ) {
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
      this.usersInRoom.push({ user: socket.user, roomId: room.id,isHost:false });
      return { data: room, event: 'roomJoined' };
    }
    const room: Room = {
      id: socket.user.id,
      inUse: false,
      host: socket.user,
    };

    this.rooms.set(`${room.id}`, room);
    this.usersInRoom.push({ user: socket.user, roomId: room.id,isHost:true });
    socket.join(room.id);
    return { data: room, event: 'roomJoined' };
  }

  @SubscribeMessage('chat')
  chat(socket: SocketWithAuth, data: { room: string; message: any }) {
    socket.in(data.room).emit('chat', data.message);
  }
}
