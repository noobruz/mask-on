import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto } from '../dto/register.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}
    @Post('')
    async signInAnon(@Body() dto:SignInDto){
        return this.authService.signIn(dto)
    }
}
