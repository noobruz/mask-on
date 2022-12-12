import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { OrmService } from './database/orm.service';

declare const module: any;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const ormService = app.get(OrmService);
  await ormService.enableShutdownHooks(app);
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
    }),
  );

  const port = configService.get<number>('app.port');
  await app.listen(port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
