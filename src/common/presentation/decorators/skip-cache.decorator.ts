import { Reflector } from '@nestjs/core';
export const SkipCache = Reflector.createDecorator<void>();
