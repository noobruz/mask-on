import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { WsCatchAllFilter } from '../exception/ws-catch-all.filter';

@UseFilters(new WsCatchAllFilter())
@UsePipes(new ValidationPipe())
@WebSocketGateway({
  namespace: 'chats',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    private readonly logger = new Logger(ChatGateway.name)
  private readonly rooms: Map<string, {}>;
  @WebSocketServer() io: Namespace;
  constructor() {
    this.rooms = new Map();
  }
  afterInit(server: any) {
    this.logger.log("Initialized Gateway Successfully")
  }
  handleConnection(client: any, ...args: any[]) {
    this.logger.log("User logged in")
  }
  handleDisconnect(client: any) {
    this.logger.log('Handle Logout')
  }
}
