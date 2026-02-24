import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../../../../domain/enums/role.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String })
  _id: string;
  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  refreshToken?: string;

  @Prop({
    type: String,
    enum: Role,
    default: Role.Regular,
  })
  role: Role;

  @Prop({ required: false })
  twoFactorAuthenticationSecret?: string;

  @Prop({ default: false })
  isTwoFactorAuthenticationEnabled: boolean;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  emailVerificationToken?: string;

  @Prop()
  passwordResetToken?: string;

  @Prop()
  passwordResetExpires?: Date;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
