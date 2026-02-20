import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { accessibleRecordsPlugin } from '@casl/mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy: User | Types.ObjectId | string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.plugin(accessibleRecordsPlugin);
