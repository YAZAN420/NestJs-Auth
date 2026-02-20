import {
  AbilityBuilder,
  InferSubjects,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/schemas/user.schema';
import { Action } from '../enums/action.enum';
import { Role } from 'src/users/enums/role.enum';
import { Product } from 'src/products/schemas/product.schema';
import { ActiveUserData } from 'src/iam/authentication/interfaces/active-user-data.interface';
import { ClsService } from 'nestjs-cls';

type Subjects = InferSubjects<typeof Product | typeof User> | 'all';
export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(private readonly cls: ClsService) {}
  createForUser() {
    const user = this.cls.get<ActiveUserData>('User');
    console.log(user);
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
      can(Action.Update, User, { _id: user.id });
    }
    return build();
  }
}
