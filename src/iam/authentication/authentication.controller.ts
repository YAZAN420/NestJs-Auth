import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Public } from './decorators/public.decorator';
import { ActiveUser } from './decorators/active-user.decorator';
import type { ActiveUserData } from './interfaces/active-user-data.interface';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() signUp: SignUpDto) {
    return this.authService.signUp(signUp);
  }
  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signIn: SignInDto) {
    return this.authService.signIn(signIn);
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  signOut() {
    return this.authService.signOut();
  }

  @ApiBearerAuth('access-token')
  @Get('me')
  getMe(@ActiveUser() user: ActiveUserData) {
    return user;
  }
}
