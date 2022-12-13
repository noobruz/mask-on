import { Injectable } from '@nestjs/common';
import { OrmService } from 'src/database/orm.service';
import { SignInDto } from '../dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly ormService: OrmService) {}

  async signIn(dto:SignInDto) {
    const user = await this.ormService.user.create({
      data: {
        username: dto.username || null,
      },
    });
    return user;
  }

  async validate(id: string) {
    const user = await this.ormService.user.findFirstOrThrow({
      where: {
        id,
      },
    });
    return user;
  }
}
