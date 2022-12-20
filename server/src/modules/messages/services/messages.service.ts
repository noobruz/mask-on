import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { OrmService } from 'src/database/orm.service';
import { CreateMessageDto } from '../dto/create-message.dto';

@Injectable()
export class MessagesService {
    constructor(private readonly ormService:OrmService){}

    async send(dto:CreateMessageDto){
        if(dto.reply_to){
           const reply = await this.find(dto.reply_to)
          return await this.ormService.chat.create({
            data:{
                message:dto.message,
                sender_id:dto.sender_id,
                reciever_id:dto.reciever_id,
                parentId:reply.id
            }
        })
        }
      return await this.ormService.chat.create({
            data:{
                message:'',
                sender_id:'',
                reciever_id:''
            }
        })
    }

    async find(id:number){
        const message = await this.ormService.chat.findFirst({
            where:{
                id
            }
        })
        if(!message){
            throw new NotFoundException('Record not found')
        }
        return message
    }
}
