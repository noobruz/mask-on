import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';

@WebSocketGateway({
  namespace: 'polls',
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
