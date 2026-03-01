import { ClsStore, Terminal } from 'nestjs-cls';
import { ClientSession } from 'mongoose';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { CLS_KEYS } from '../constants/cls-keys.constant'; // 👈 استيراد الثوابت

export interface AppClsStore extends ClsStore {
  [CLS_KEYS.MONGO_SESSION]?: Terminal<ClientSession>;
  [CLS_KEYS.USER]?: ActiveUserData;
}
