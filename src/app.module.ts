import { CoreModule } from './core/core.module';
import { UsersInfrastructureModule } from './users/infrastructure/users-infrastructure.module';
import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/application/users.module';
import { IamModule } from './iam/iam.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { validate } from './config/env.validation';
import { ClsModule } from 'nestjs-cls';
import { ThrottlerModule } from '@nestjs/throttler';
import { MailModule } from './mail/mail.module';
import { ApplicationBootstrapOptions } from './common/interfaces/application-bootstrap-options.interface';

@Module({
  imports: [
    CoreModule,
    UsersInfrastructureModule,
    ProductsModule,
    IamModule,
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      validate: validate,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
  ],
  providers: [],
})
export class AppModule {
  static register(options: ApplicationBootstrapOptions) {
    return {
      module: AppModule,
      imports: [
        CoreModule.forRoot({ driver: options.driver }),
        UsersModule.withInfrastructure(
          UsersInfrastructureModule.use(options.driver),
        ),
      ],
    };
  }
}
