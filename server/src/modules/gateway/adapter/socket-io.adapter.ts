import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Server } from 'socket.io';
import { AuthPayload, SocketWithAuth } from 'src/common/types/types';
import { AuthService } from 'src/modules/auth/services/auth.service';

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

    server.use(createTokenMiddleware(this.logger, this.app.get(AuthService)));

    return server;
  }
}
const createTokenMiddleware =
  (logger: Logger, authService: AuthService) =>
  (socket: SocketWithAuth, next) => {
    // for Postman testing support, fallback to token header
    const payload = socket.handshake.headers['user'] as string;
    const authPayload: AuthPayload = JSON.parse(payload);
    try {
      authService.validate(authPayload.userID).then((user) => {
        if (user == null) {
          next(new Error('FORBIDDEN'));
        }
      });
      socket.userID = authPayload.userID;
      socket.name = authPayload.userID;
      next();
    } catch (e) {
      logger.error(e);
      next(new Error('FORBIDDEN'));
    }
  };
