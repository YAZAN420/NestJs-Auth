import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from '../enums/action.enum';
import { Role } from 'src/users/domain/enums/role.enum';
import { Product } from 'src/products/infrastructure/persistence/mongoose/schemas/product.schema';
import { ActiveUserData } from 'src/iam/authentication/interfaces/active-user-data.interface';
import { ClsService } from 'nestjs-cls';
import { User } from 'src/users/domain/user';

type Subjects = InferSubjects<typeof Product | typeof User> | 'all';
export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(private readonly cls: ClsService) {}
  createForUser() {
    const user = this.cls.get<ActiveUserData>('User');
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
    if (!user) {
      return build();
    }
    if (user.role === Role.Admin) {
      can(Action.Manage, 'all');
    } else {
      can(Action.Read, Product);
      can(Action.Create, Product);
      can(Action.Update, Product, { createdBy: user.id });
      can(Action.Delete, Product, { createdBy: user.id });
    }
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
