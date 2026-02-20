import { Reflector } from '@nestjs/core';
import { PolicyHandler } from '../policies/interfaces/policy-handler.interface';

export const CheckPolicies = Reflector.createDecorator<PolicyHandler[]>();
