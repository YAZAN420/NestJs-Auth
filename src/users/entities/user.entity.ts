import { Expose, Transform } from 'class-transformer';
import { Role } from '../enums/role.enum';
import { Types } from 'mongoose';

export class UserEntity {
  @Expose()
  @Transform(({ value }: { value: Types.ObjectId }) => value?.toString())
  id: string;
  @Expose()
  username: string;
  @Expose()
  email: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
  @Expose()
  role: Role;
}
