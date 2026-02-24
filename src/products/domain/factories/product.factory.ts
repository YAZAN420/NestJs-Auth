import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { Product } from '../product';
@Injectable()
export class ProductFactory {
  public createNew(
    name: string,
    description: string,
    price: number,
    createdBy: string,
  ): Product {
    const id: string = uuidv7();
    return new Product(
      id,
      name,
      description,
      price,
      createdBy,
      new Date(),
      new Date(),
    );
  }
  public reconstitute(
    id: string,
    name: string,
    description: string,
    price: number,
    createdBy: string,
    createdAt: Date,
    updatedAt: Date,
  ): Product {
    return new Product(
      id,
      name,
      description,
      price,
      createdBy,
      createdAt,
      updatedAt,
    );
  }
}
