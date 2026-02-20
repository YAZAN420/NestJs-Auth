import { forwardRef, Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { HashingModule } from './hashing/hashing.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './authentication/strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { RolesGuard } from './authorization/guards/roles.guard';
import { CaslModule } from './authorization/casl/casl.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      useFactory: (jwtConfiguration: ConfigType<typeof jwtConfig>) => ({
        secret: jwtConfiguration.secret,
        signOptions: {
          audience: jwtConfiguration.audience,
          issuer: jwtConfiguration.issuer,
          expiresIn: jwtConfiguration.accessTokenTtl,
        },
      }),
      inject: [jwtConfig.KEY],
    }),
    HashingModule,
    CaslModule,
    forwardRef(() => AuthenticationModule),
  ],
  providers: [
    JwtStrategy,
    { provide: APP_GUARD, useClass: AccessTokenGuard },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [
    ConfigModule,
    JwtModule,
    HashingModule,
    AuthenticationModule,
    CaslModule,
  ],
})
export class IamModule {}
