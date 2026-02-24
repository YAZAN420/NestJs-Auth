import { Role } from './enums/role.enum';
import { Email } from './value-objects/email.vo';
import { Username } from './value-objects/username.vo';

export class User {
  constructor(
    public id: string,
    private username: Username,
    private email: Email,
    private role: Role,
    private passwordHash: string,
    private createdAt: Date,
    private updatedAt: Date,
    private isEmailVerified: boolean,
    private isTwoFactorAuthenticationEnabled: boolean,
    private refreshToken?: string | null,
    private twoFactorAuthenticationSecret?: string | null,
    private emailVerificationToken?: string | null,
    private passwordResetToken?: string | null,
    private passwordResetExpires?: Date | null,
  ) {}

  public getId(): string {
    return this.id;
  }
  public getUsernameValue(): string {
    return this.username.getValue();
  }
  public getEmailValue(): string {
    return this.email.getValue();
  }
  public getRole(): Role {
    return this.role;
  }
  public getPasswordHash(): string {
    return this.passwordHash;
  }
  public getIsTwoFactorAuthenticationEnabled(): boolean {
    return this.isTwoFactorAuthenticationEnabled;
  }
  public getIsEmailVerified(): boolean {
    return this.isEmailVerified;
  }
  public getRefreshToken(): string | null | undefined {
    return this.refreshToken;
  }
  public getTwoFactorAuthenticationSecret(): string | null | undefined {
    return this.twoFactorAuthenticationSecret;
  }
  public getEmailVerificationToken(): string | null | undefined {
    return this.emailVerificationToken;
  }
  public getPasswordResetToken(): string | null | undefined {
    return this.passwordResetToken;
  }
  public getPasswordResetExpires(): Date | null | undefined {
    return this.passwordResetExpires;
  }
  public getCreatedAt(): Date {
    return this.createdAt;
  }
  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public updateRefreshToken(newToken: string | null): void {
    this.refreshToken = newToken;
  }

  public validateRefreshToken(tokenToValidate: string): boolean {
    return this.refreshToken === tokenToValidate;
  }

  public verifyEmail(providedToken: string): void {
    if (this.isEmailVerified) {
      throw new Error('The email is preconfirmed');
    }

    if (this.emailVerificationToken !== providedToken) {
      throw new Error('Invalid verification token');
    }

    this.isEmailVerified = true;
    this.emailVerificationToken = null;
  }

  public enableTwoFactorAuth(secret: string): void {
    if (!this.isEmailVerified) {
      throw new Error(
        'Email must be confirmed first before enabling two-factor authentication',
      );
    }
    this.isTwoFactorAuthenticationEnabled = true;
    this.twoFactorAuthenticationSecret = secret;
  }

  public disableTwoFactorAuth(): void {
    this.isTwoFactorAuthenticationEnabled = false;
    this.twoFactorAuthenticationSecret = undefined;
  }

  public changePassword(newPasswordHash: string): void {
    this.passwordHash = newPasswordHash;
  }

  public changeRole(newRole: Role): void {
    this.role = newRole;
  }
  public generatePasswordResetToken(token: string, expiresAt: Date): void {
    this.passwordResetToken = token;
    this.passwordResetExpires = expiresAt;
  }
  public resetPasswordWithToken(
    newPasswordHash: string,
    providedToken: string,
  ): void {
    if (this.passwordResetToken !== providedToken) {
      throw new Error('Invalid reset token');
    }

    if (!this.passwordResetExpires || this.passwordResetExpires < new Date()) {
      throw new Error('Reset token has expired');
    }

    this.passwordHash = newPasswordHash;
    this.passwordResetToken = undefined;
    this.passwordResetExpires = undefined;
  }
  public changeUsername(newUsernameStr: string): void {
    const newUsernameVo = new Username(newUsernameStr);
    this.username = newUsernameVo;
  }

  public setVerificationToken(emailVerificationToken: string): void {
    this.emailVerificationToken = emailVerificationToken;
  }
  public setTwoFactorSecret(twoFactorAuthenticationSecret: string): void {
    this.twoFactorAuthenticationSecret = twoFactorAuthenticationSecret;
  }
}
