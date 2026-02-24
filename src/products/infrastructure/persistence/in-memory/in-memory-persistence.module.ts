import { Module } from '@nestjs/common';
import { ProductMapper } from './mappers/product.mapper';
import { ProductRepository } from 'src/products/application/ports/product.repository';
import { InMemoryProductRepository } from './repositories/product.repository';
import { ProductFactory } from 'src/products/domain/factories/product.factory';

@Module({
  providers: [
    ProductMapper,
    { provide: ProductRepository, useClass: InMemoryProductRepository },
    ProductFactory,
  ],
  exports: [ProductRepository],
})
export class InMemoryProductPersistenceModule {}
