import { User } from 'src/users/infrastructure/persistence/mongoose/schemas/user.schema';

export class Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  createdBy: User | string;
  createdAt: Date;
  updatedAt: Date;
}
