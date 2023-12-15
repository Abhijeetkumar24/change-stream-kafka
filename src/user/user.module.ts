import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { KafkaModule } from 'src/providers/kafka/kafka.module';
import { Product, ProductSchema } from './schemas/product.schema';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                { name: User.name, schema: UserSchema },
                { name: Product.name, schema: ProductSchema },
            ], 'change_stream_1'
        ),

        MongooseModule.forFeature(
            [
                { name: User.name, schema: UserSchema },
                { name: Product.name, schema: ProductSchema },
            ], 'change_stream_2'
        ),

        KafkaModule,
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule { }
