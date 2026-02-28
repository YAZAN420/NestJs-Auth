import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/domain/user';
import { Action } from '../../../domain/enums/action.enum';
import { Role } from 'src/users/domain/enums/role.enum';
import { ActiveUserData } from '../../../domain/interfaces/active-user-data.interface';
import { Product } from 'src/products/domain/product';

type Subjects = InferSubjects<typeof Product | typeof User> | 'all';
export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: ActiveUserData) {
    const builder = new AbilityBuilder<AppAbility>(createMongoAbility);

    if (user.role === Role.Admin) {
      builder.can(Action.Manage, 'all');
    } else {
      this.applyProductPolicies(user, builder);
      this.applyUserPolicies(user, builder);
    }

    return builder.build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  private applyProductPolicies(
    user: ActiveUserData,
    builder: AbilityBuilder<AppAbility>,
  ) {
    const { can } = builder;
    can(Action.Read, Product);
    can(Action.Create, Product);
    can(Action.Update, Product, { createdBy: user.id });
    can(Action.Delete, Product, { createdBy: user.id });
  }
  private applyUserPolicies(
    user: ActiveUserData,
    builder: AbilityBuilder<AppAbility>,
  ) {
    const { can } = builder;
    can(Action.Read, User, { id: user.id });
    can(Action.Update, User, { id: user.id });
  }
}
