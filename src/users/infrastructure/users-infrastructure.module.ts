import { Module } from '@nestjs/common';
import { MongooseUserPersistenceModule } from './persistence/mongoose/mongoose-persistence.module';
import { InMemoryUserPersistenceModule } from './persistence/in-memory/in-memory-persistence.module';

@Module({})
export class UsersInfrastructureModule {
  static use(driver: 'mongoose' | 'in-memory') {
    const persistenceModule =
      driver === 'mongoose'
        ? MongooseUserPersistenceModule
        : InMemoryUserPersistenceModule;
    return {
      module: persistenceModule,
      imports: [persistenceModule],
      exports: [persistenceModule],
    };
  }
}
