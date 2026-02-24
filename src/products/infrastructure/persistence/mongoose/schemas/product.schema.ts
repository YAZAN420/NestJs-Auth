import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/infrastructure/persistence/mongoose/schemas/user.schema';
import { accessibleRecordsPlugin } from '@casl/mongoose';

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: String })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: String, ref: 'User' })
  createdBy: User | string;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.plugin(accessibleRecordsPlugin);
