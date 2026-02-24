import { Module } from '@nestjs/common';
import { UserRepository } from 'src/users/application/ports/user.repository';
import { InMemoryUserRepository } from './repositories/user.repository';
import { UserFactory } from 'src/users/domain/factories/user.factory';
import { UserMapper } from './mappers/user.mapper';

@Module({
  providers: [
    UserFactory,
    UserMapper,
    {
      provide: UserRepository,
      useClass: InMemoryUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class InMemoryUserPersistenceModule {}
