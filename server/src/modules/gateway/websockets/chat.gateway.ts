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

// @UseFilters(new WsCatchAllFilter())
// @UsePipes(new ValidationPipe())
@WebSocketGateway({
  namespace: 'chats',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);
  private readonly rooms: Map<string, Room>;
  private readonly users: Array<User>;
  @WebSocketServer() io: Namespace;
  constructor(private readonly authService: AuthService) {
    this.rooms = new Map();
  }
  afterInit(server: any) {
    this.logger.log('Initialized Gateway Successfully');
  }
  async handleConnection(client: SocketWithAuth) {
    this.logger.log('User logged in ' + client.user.id);
    this.users.push({
      id: client.user.id,
      username: client.user.username,
    });
  }
  handleDisconnect(client: any) {
    this.logger.log('Handle Logout');
  }

  @SubscribeMessage('joinOrHost')
  async createOrJoinRoom(socket: SocketWithAuth): Promise<WsResponse<any>> {
    const roomKeys = [...this.rooms.keys()];
    const emptyRoomKeys = roomKeys.filter(
      (key) => this.rooms.get(key).inUse == false,
    );
    if (emptyRoomKeys) {
      const key = emptyRoomKeys[0];
      const room = this.rooms.get(key);
      room.client = socket.user;
      room.inUse = true;
      socket.join(room.id);
      socket.in(room.id).emit('roomJoined', { event: 'client joined', room });
      this.rooms.set(key, room);
      return;
    }
    const room: Room = {
      id: socket.user.id,
      inUse: false,
      host: socket.user,
    };
    this.rooms.set(`${room.id}`, room);
    socket.join(room.id);
    socket.in(room.id).emit('roomJoined', { event: 'hosted a room', room });
  }
}
