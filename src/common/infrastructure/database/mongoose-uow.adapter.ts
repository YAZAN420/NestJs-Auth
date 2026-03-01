import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ClsService } from 'nestjs-cls';
import { UnitOfWorkPort } from '../../application/ports/unit-of-work.port';
import { AppClsStore } from 'src/common/interfaces/app-cls-store.interface';
import { CLS_KEYS } from 'src/common/constants/cls-keys.constant';

@Injectable()
export class MongooseUnitOfWorkAdapter implements UnitOfWorkPort {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly cls: ClsService<AppClsStore>,
  ) {}

  async execute<T>(work: () => Promise<T>): Promise<T> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      return await this.cls.runWith(
        { [CLS_KEYS.MONGO_SESSION]: session },
        async () => {
          const result = await work();
          await session.commitTransaction();
          return result;
        },
      );
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
