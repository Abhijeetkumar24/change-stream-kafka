import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type UserDocument = HydratedDocument<Product>;


@Schema()
export class Product {

    @Prop()
    name: string;

    @Prop()
    price: string;

    @Prop()
    stock: string;

}

export const ProductSchema = SchemaFactory.createForClass(Product)