import { Global, Module } from '@nestjs/common';
import { UnitOfWorkPort } from '../../application/ports/unit-of-work.port';
import { MongooseUnitOfWorkAdapter } from './mongoose-uow.adapter';

@Global()
@Module({
  providers: [
    {
      provide: UnitOfWorkPort,
      useClass: MongooseUnitOfWorkAdapter,
    },
  ],
  exports: [UnitOfWorkPort],
})
export class DatabaseModule {}
