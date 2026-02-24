import { Module } from '@nestjs/common';
import { InMemoryProductPersistenceModule } from './persistence/in-memory/in-memory-persistence.module';
import { MongooseProductPersistenceModule } from './persistence/mongoose/mongoose-persistence.module';

@Module({})
export class ProductInfrastructureModule {
  static use(driver: 'mongoose' | 'in-memory') {
    const persistenceModule =
      driver === 'mongoose'
        ? MongooseProductPersistenceModule
        : InMemoryProductPersistenceModule;
    return {
      module: persistenceModule,
      imports: [persistenceModule],
      exports: [persistenceModule],
    };
  }
}
