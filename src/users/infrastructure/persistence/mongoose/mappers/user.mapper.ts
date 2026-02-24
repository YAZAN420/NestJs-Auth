import { Injectable } from '@nestjs/common';
import { User } from 'src/users/domain/user';
import { User as MongoUser } from '../schemas/user.schema';
import { UserFactory } from 'src/users/domain/factories/user.factory';

@Injectable()
export class UserMapper {
  constructor(private readonly userFactory: UserFactory) {}

  toDomain(doc: MongoUser): User {
    return this.userFactory.reconstitute(
      doc._id,
      doc.username,
      doc.email,
      doc.password,
      doc.role,
      doc.createdAt!,
      doc.updatedAt!,
      doc.isEmailVerified,
      doc.isTwoFactorAuthenticationEnabled,
      doc.refreshToken,
      doc.twoFactorAuthenticationSecret,
      doc.emailVerificationToken,
      doc.passwordResetToken,
      doc.passwordResetExpires,
    );
  }

  toPersistence(user: User): Record<string, any> {
    return {
      _id: user.getId(),
      username: user.getUsernameValue(),
      email: user.getEmailValue(),
      role: user.getRole(),
      password: user.getPasswordHash(),
      isTwoFactorAuthenticationEnabled:
        user.getIsTwoFactorAuthenticationEnabled(),
      isEmailVerified: user.getIsEmailVerified(),
      refreshToken: user.getRefreshToken(),
      twoFactorAuthenticationSecret: user.getTwoFactorAuthenticationSecret(),
      emailVerificationToken: user.getEmailVerificationToken(),
      passwordResetToken: user.getPasswordResetToken(),
      passwordResetExpires: user.getPasswordResetExpires(),
    };
  }
}
