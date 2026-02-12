import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { HashingModule } from './hashing/hashing.module';

@Module({
  imports: [HashingModule, AuthenticationModule],
  exports: [HashingModule, AuthenticationModule],
})
export class IamModule {}
