import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create.user.dto';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create.product';


@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name, 'change_stream_1') private UserModelDb1: Model<User>,
        @InjectModel(User.name, 'change_stream_2') private UserModelDb2: Model<User>,
        @InjectModel(Product.name, 'change_stream_1') private ProductModelDb1: Model<Product>,
        @InjectModel(Product.name, 'change_stream_2') private ProductModelDb2: Model<Product>,
    ) { }


    async userDb1(createUserDto: CreateUserDto): Promise<any> {

        const newUser = new this.UserModelDb1(createUserDto);
        return newUser.save();
    }


    async userDb2(createUserDto: CreateUserDto): Promise<any> {

        const newUser = new this.UserModelDb2(createUserDto);
        return newUser.save();
    }

    async productDb1(createProductDto: CreateProductDto): Promise<any> {

        const newProduct = new this.ProductModelDb1(createProductDto);
        return newProduct.save();
    }

    async productDb2(createProductDto: CreateProductDto): Promise<any> {

        const newProduct = new this.ProductModelDb2(createProductDto);
        return newProduct.save();
    }

}


