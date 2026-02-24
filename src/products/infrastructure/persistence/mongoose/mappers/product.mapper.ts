import { Injectable } from '@nestjs/common';
import { ProductFactory } from 'src/products/domain/factories/product.factory';
import { Product } from 'src/products/domain/product';
import { Product as MongoProduct } from '../schemas/product.schema';

@Injectable()
export class ProductMapper {
  constructor(private readonly productFactory: ProductFactory) {}

  toDomain(doc: MongoProduct): Product {
    let createdById: string;
    if (typeof doc.createdBy === 'string') {
      createdById = doc.createdBy;
    } else {
      createdById = doc.createdBy._id;
    }
    return this.productFactory.reconstitute(
      doc._id,
      doc.name,
      doc.description,
      doc.price,
      createdById,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  toPersistence(user: Product): Record<string, any> {
    return {
      _id: user.getId(),
      name: user.getName(),
      description: user.getDescription(),
      price: user.getPrice(),
      createdBy: user.getCreatedBy(),
    };
  }
}
