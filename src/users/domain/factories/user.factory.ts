import { Injectable } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { Email } from '../value-objects/email.vo';
import { User } from '../user';
import { Username } from '../value-objects/username.vo';
import { v7 as uuidv7 } from 'uuid';
@Injectable()
export class UserFactory {
  public createNew(
    usernameStr: string,
    emailStr: string,
    passwordHash: string,
  ): User {
    const email = new Email(emailStr);
    const username = new Username(usernameStr);
    const id: string = uuidv7();
    return new User(
      id,
      username,
      email,
      Role.Regular,
      passwordHash,
      new Date(),
      new Date(),
      false,
      false,
    );
  }
  public reconstitute(
    id: string,
    usernameStr: string,
    emailStr: string,
    passwordHash: string,
    role: Role,
    createdAt: Date,
    updatedAt: Date,
    isEmailVerified: boolean,
    isTwoFactorEnabled: boolean,
    refreshToken?: string | null,
    twoFactorAuthenticationSecret?: string,
    emailVerificationToken?: string,
    passwordResetToken?: string,
    passwordResetExpires?: Date,
  ): User {
    return new User(
      id,
      new Username(usernameStr),
      new Email(emailStr),
      role,
      passwordHash,
      createdAt,
      updatedAt,
      isEmailVerified,
      isTwoFactorEnabled,
      refreshToken,
      twoFactorAuthenticationSecret,
      emailVerificationToken,
      passwordResetToken,
      passwordResetExpires,
    );
  }
}
