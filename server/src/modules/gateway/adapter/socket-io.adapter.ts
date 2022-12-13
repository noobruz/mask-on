import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Server } from 'socket.io';
import { AuthPayload, SocketWithAuth } from 'src/common/types/types';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { WsUnauthorizedException } from '../exception/ws-exceptions';

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  constructor(
    private readonly app: INestApplicationContext,
    private readonly configService: ConfigService,
  ) {
    super(app);
  }
  createIOServer(port: number, options?: ServerOptions) {
    const clientPort = parseInt(this.configService.get('CLIENT_PORT'));

    const cors = {
      origin: ['*'],
    };
    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
    };
    const server: Server = super.createIOServer(port, optionsWithCORS);

    server
      .of('chats')
      .use(createTokenMiddleware(this.logger, this.app.get(AuthService)));

    return server;
  }
}
const createTokenMiddleware =
  (logger: Logger, authService: AuthService) =>
  (socket: SocketWithAuth, next) => {
    const payload = (socket.handshake.headers['user'] as string) || '';
    authService
      .validate(payload)
      .then((user) => {
        socket.userID = user.id;
        socket.name = user.username;
        next();
      })
      .catch((e) => next(new Error('FORBIDDEN')));
  };
