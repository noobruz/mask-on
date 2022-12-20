import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMessageDto {
    @IsNotEmpty()
    @IsString()
    sender_id:string
    @IsNotEmpty()
    @IsString()
    reciever_id:string
    @IsNotEmpty()
    @IsString()
    message:string
    @IsOptional()
    @IsNumber()
    reply_to:number
}