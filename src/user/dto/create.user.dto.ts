import { IsString, IsEmail, IsNumber } from 'class-validator';


export class CreateUserDto {

    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsNumber()
    age: number;
}