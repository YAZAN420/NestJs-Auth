import { User } from 'src/users/domain/user';

export class UserResponseDto {
  id: string;
  username: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  isTwoFactorAuthenticationEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.getId();

    dto.username = user.getUsernameValue();
    dto.email = user.getEmailValue();
    dto.role = user.getRole();
    dto.isEmailVerified = user.getIsEmailVerified();
    dto.isTwoFactorAuthenticationEnabled =
      user.getIsTwoFactorAuthenticationEnabled();
    dto.createdAt = user.getCreatedAt();
    dto.updatedAt = user.getUpdatedAt();

    return dto;
  }
}
