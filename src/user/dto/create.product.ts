import { IsString, IsEmail } from 'class-validator';


export class CreateProductDto {

    @IsString()
    name: string;

    @IsEmail()
    price: string;

    @IsString()
    stock: string;

}