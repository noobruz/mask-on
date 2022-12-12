// import { ConfigService } from '@nestjs/config';
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class OrmService extends PrismaClient implements OnModuleInit {
    // constructor(private configService: ConfigService) {}

    async onModuleInit() {
        await this.$connect();
    }

    async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            await app.close();
        });
    }

}
