import { Role } from '../../../../domain/enums/role.enum';

export class User {
  _id: string;
  username: string;
  email: string;
  password: string;
  refreshToken?: string;
  role: Role;
  twoFactorAuthenticationSecret?: string;
  isTwoFactorAuthenticationEnabled: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
