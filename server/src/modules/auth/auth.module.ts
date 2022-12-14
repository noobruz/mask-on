import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  providers: [AuthService],
  controllers:[AuthController],
  exports:''
})
export class AuthModule {}
