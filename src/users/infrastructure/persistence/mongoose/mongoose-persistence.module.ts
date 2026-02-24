import { Module } from '@nestjs/common';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from 'src/users/application/ports/user.repository';
import { MongooseUserRepository } from './repositories/user.repository';
import { UserMapper } from './mappers/user.mapper';
import { UserFactory } from 'src/users/domain/factories/user.factory';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    UserMapper,
    UserFactory,
    {
      provide: UserRepository,
      useClass: MongooseUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class MongooseUserPersistenceModule {}
