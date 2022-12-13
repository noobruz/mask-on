import { Module } from '@nestjs/common';
import { AuthService } from '../auth/services/auth.service';
import { ChatGateway } from './websockets/chat.gateway';

@Module({
    providers:[ChatGateway]    
})
export class GatewayModule {
}
