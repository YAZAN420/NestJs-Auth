import { Module, DynamicModule } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { IamModule } from './iam/iam.module';
import { MailModule } from './shared/mail/mail.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { UsersInfrastructureModule } from './users/infrastructure/users-infrastructure.module';
import { ProductInfrastructureModule } from './products/infrastructure/product-infrastructure.module';
import { ApplicationBootstrapOptions } from './common/interfaces/application-bootstrap-options.interface';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpCacheInterceptor } from './common/presentation/interceptors/http-cache.interceptor';
import { CacheModule } from './common/infrastructure/cache/cache.module';

@Module({
  imports: [IamModule, MailModule, CacheModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
  ],
})
export class AppModule {
  static register(options: ApplicationBootstrapOptions): DynamicModule {
    return {
      module: AppModule,
      imports: [
        CoreModule.forRoot({ driver: options.driver }),

        UsersModule.withInfrastructure(
          UsersInfrastructureModule.use(options.driver),
        ),
        ProductsModule.withInfrastructure(
          ProductInfrastructureModule.use(options.driver),
        ),
      ],
    };
  }
}
