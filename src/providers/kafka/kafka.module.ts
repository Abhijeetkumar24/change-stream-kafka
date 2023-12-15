import { Module } from '@nestjs/common';
import { KafkaProducerService } from './kafka.producer.service';
import { KafkaConsumerService } from './kafka.consumer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { Product, ProductSchema } from 'src/user/schemas/product.schema';

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
    ],
    providers: [KafkaProducerService, KafkaConsumerService],
    exports: [KafkaProducerService, KafkaConsumerService],
})
export class KafkaModule { }
