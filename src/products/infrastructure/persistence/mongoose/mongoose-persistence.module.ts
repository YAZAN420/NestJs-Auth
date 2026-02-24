import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductMapper } from './mappers/product.mapper';
import { ProductRepository } from 'src/products/application/ports/product.repository';
import { MongooseProductRepository } from './repositories/product.repository';
import { ProductFactory } from 'src/products/domain/factories/product.factory';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  providers: [
    ProductMapper,
    ProductFactory,
    {
      provide: ProductRepository,
      useClass: MongooseProductRepository,
    },
  ],
  exports: [ProductRepository],
})
export class MongooseProductPersistenceModule {}
