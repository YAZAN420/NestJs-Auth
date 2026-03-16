import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Public } from '../decorators/public.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  getRequest(context: ExecutionContext): any {
    const type = context.getType<'http' | 'ws' | 'graphql'>();
    if (type === 'ws') {
      const client = context.switchToWs().getClient<Socket>();
      return client.handshake;
    }
    if (type === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context).getContext<{
        req: unknown;
      }>();
      return gqlContext.req;
    }
    return context.switchToHttp().getRequest();
  }

  handleRequest<TUser = ActiveUserData>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ) {
    if (err || !user) {
      const type = context.getType<'http' | 'ws' | 'graphql'>();
      if (type === 'ws') {
        throw new WsException('Unauthorized: Missing or invalid token');
      }
      throw err || new UnauthorizedException();
    }
    const type = context.getType<'http' | 'ws' | 'graphql'>();
    if (type === 'ws') {
      const client = context.switchToWs().getClient<Socket & { user?: any }>();
      client.user = user as TUser;
    }
    return user as TUser;
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride(Public, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
