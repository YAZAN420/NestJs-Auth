import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClsService } from 'nestjs-cls';

import { CheckPolicies } from '../decorators/check-policies.decorator';
import { AuthorizationPort } from '../../../application/ports/authorization.port';
import { ActiveUserData } from '../../../domain/interfaces/active-user-data.interface';
import { PolicyHandler } from '../interfaces/policy-handler.interface';
import { AppClsStore } from 'src/common/interfaces/app-cls-store.interface';
import { CLS_KEYS } from 'src/common/constants/cls-keys.constant';
import { Socket } from 'socket.io';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authorizationPort: AuthorizationPort,
    private readonly cls: ClsService<AppClsStore>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const policyHandlers =
      this.reflector.getAllAndOverride<PolicyHandler[]>(CheckPolicies, [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    if (!policyHandlers.length) {
      return true;
    }

    let user: ActiveUserData | undefined;

    if (this.cls.isActive()) {
      user = this.cls.get<ActiveUserData>(CLS_KEYS.USER);
    }
    if (!user) {
      const type = context.getType<'http' | 'ws' | 'graphql'>();
      if (type === 'ws') {
        const client = context
          .switchToWs()
          .getClient<Socket & { user?: ActiveUserData }>();
        user = client.user;
      }
    }

    const isAllowed = policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, user as ActiveUserData),
    );

    if (!isAllowed) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    return true;
  }

  private execPolicyHandler(handler: PolicyHandler, user: ActiveUserData) {
    if (typeof handler === 'function') {
      return handler(this.authorizationPort, user);
    }
    return handler.handle(this.authorizationPort, user);
  }
}
