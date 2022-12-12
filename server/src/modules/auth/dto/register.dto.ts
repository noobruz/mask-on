import { IsString,IsNotEmpty,IsOptional } from "class-validator";

export class SignInDto {
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    username:string
}