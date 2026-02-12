import { Inject, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { UsersService } from 'src/users/users.service';
import { HashingService } from '../hashing/hashing.service';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from 'src/users/entities/user.entity';
import jwtConfig from 'src/config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UsersService,
    private readonly hashService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  async signUp(signUp: SignUpDto) {
    return await this.userService.create(signUp);
  }

  async signIn(signIn: SignInDto) {
    const user = await this.userService.findOneEmail(signIn.email);
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
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user._id.toString(),
        email: user.email,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );
    return {
      message: 'User signed in successfully',
      accessToken,
      user: plainToInstance(UserEntity, user.toObject(), {
        excludeExtraneousValues: true,
      }),
    };
  }
  signOut() {
    return { message: 'User signed out successfully' };
  }
}
