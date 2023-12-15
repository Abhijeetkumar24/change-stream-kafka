import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { UserService } from './user.service';
import { CreateProductDto } from './dto/create.product';

@Controller('user')
export class UserController {


    constructor(private userService: UserService) { }

    @Post('create-user-db1')
    async userDb1(@Body() createUserDto: CreateUserDto): Promise<any> {

        return this.userService.userDb1(createUserDto);
    }

    @Post('create-user-db2')
    async userDb2(@Body() createUserDto: CreateUserDto): Promise<any> {

        return this.userService.userDb2(createUserDto);
    }

    @Post('create-product-db1')
    async productDb1(@Body() createProductDto: CreateProductDto): Promise<any> {

        return this.userService.productDb1(createProductDto);
    }

    @Post('create-product-db2')
    async productDb2(@Body() createProductDto: CreateProductDto): Promise<any> {

        return this.userService.productDb2(createProductDto);
    }


}
