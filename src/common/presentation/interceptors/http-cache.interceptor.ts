import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CachePort } from 'src/common/application/ports/cache.port';
import { Reflector } from '@nestjs/core';
import { SkipCache } from '../decorators/skip-cache.decorator';
import { CachePublic } from '../decorators/cache-public.decorator';
import { ClsService } from 'nestjs-cls';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';

@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  constructor(
    private readonly cachePort: CachePort,
    private readonly reflector: Reflector,
    private readonly cls: ClsService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();

    const skipCache = this.reflector.getAllAndOverride<boolean>(SkipCache, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipCache || request.method !== 'GET') {
      return next.handle();
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(CachePublic, [
      context.getHandler(),
      context.getClass(),
    ]);

    let cacheKey = `GET:${request.url}`;

    const user = this.cls.get<ActiveUserData>('User');

    if (user && user.id && !isPublic) {
      cacheKey = `${cacheKey}:${user.id}`;
    }

    const cachedData = await this.cachePort.get(cacheKey);
    if (cachedData) {
      return of(cachedData);
    }
    return next.handle().pipe(
      tap((response) => {
        this.cachePort.set(cacheKey, response, 600).catch((err) => {
          console.error('Redis Cache Set Error:', err);
        });
      }),
    );
  }
}
