import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationBootstrapOptions } from 'src/common/interfaces/application-bootstrap-options.interface';
import databaseConfig from 'src/config/database.config';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class CoreModule {
  static forRoot(options: ApplicationBootstrapOptions) {
    const imports =
      options.driver === 'mongoose'
        ? [
            MongooseModule.forRootAsync({
              useFactory: (
                databaseConfiguration: ConfigType<typeof databaseConfig>,
              ) => ({
                uri: databaseConfiguration.uri,
              }),
              inject: [databaseConfig.KEY],
            }),
          ]
        : [];
    return {
      module: CoreModule,
      imports,
    };
  }
}
