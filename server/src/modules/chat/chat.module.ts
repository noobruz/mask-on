import { Module } from '@nestjs/common';
import { ChatService } from './services/chat.service';

@Module({
  providers: [ChatService]
})
export class ChatModule {}
