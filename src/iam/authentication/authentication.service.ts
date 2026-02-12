import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { UsersService } from 'src/users/users.service';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { HashingService } from '../hashing/hashing.service';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UsersService,
    private readonly hashService: HashingService,
  ) {}
  async signUp(signUp: SignUpDto) {
    return await this.userService.create(signUp);
  }

  async signIn(signIn: SignInDto) {
    const user: HydratedDocument<User> = await this.userService.findOneEmail(
      signIn.email,
    );
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isPasswordValid = await this.hashService.compare(
      signIn.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    return {
      message: 'User signed in successfully',
      user: plainToInstance(UserEntity, user.toObject(), {
        excludeExtraneousValues: true,
      }),
    };
  }
  signOut() {
    return { message: 'User signed out successfully' };
  }
}
