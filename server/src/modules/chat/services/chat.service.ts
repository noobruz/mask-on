import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { OrmService } from 'src/database/orm.service';

@Injectable()
export class ChatService {
    constructor(private readonly ormService:OrmService){}

    async create(dto: { message: string; sender_id: string; reciever_id: string; }){
        const chat = await this.ormService.chat.create({
            data:{
                message:dto.message,
                sender:{
                    connect:{
                        id:dto.sender_id,
                    }
                },
                reciever:{
                    connect:{
                        id:dto.reciever_id
                    }
                }
            }
        })
        return chat 
    }

    async update(id: any,dto: any){
        const chat = await this.ormService.chat.findFirst({
            where:{
                id
            }
        })
        if (!chat) {
            throw new BadRequestException('Error occured')
        }
        await this.ormService.chat.update({
            where:{
                id
            },
            data:dto
        })
    }
}
