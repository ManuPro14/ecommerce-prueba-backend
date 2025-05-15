import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  sku: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ type: 'ObjectId', ref: 'User', required: true })
  seller: User;
}

export const ProductSchema = SchemaFactory.createForClass(Product);