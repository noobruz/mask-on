import { Global, Module } from '@nestjs/common';
import { OrmService } from './orm.service';

@Global()
@Module({
    providers: [OrmService],
    imports: [],
    exports: [OrmService],
})
export class DatabaseModule {}
