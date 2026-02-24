import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { CaslAbilityFactory } from 'src/iam/authorization/casl/casl-ability.factory';
import { UserRepository } from 'src/users/application/ports/user.repository';
import { UserFactory } from 'src/users/domain/factories/user.factory';
import { User } from 'src/users/domain/user';
import { CreateUserCommand } from 'src/users/application/commands/create-user.command';
import { Action } from 'src/iam/authorization/enums/action.enum';
import { UpdateUserCommand } from './commands/update-user.command';

@Injectable()
export class UsersService {
  constructor(
    private readonly abilityFactory: CaslAbilityFactory,
    private readonly hashService: HashingService,
    private readonly userRepository: UserRepository,
    private readonly userFactory: UserFactory,
  ) {}

  async create(command: CreateUserCommand): Promise<User> {
    const emailExists = await this.userRepository.findByEmail(command.email);
    if (emailExists) throw new ConflictException('Email already exists');

    const usernameExists = await this.userRepository.findByUsername(
      command.username,
    );
    if (usernameExists) throw new ConflictException('Username already exists');

    const hashedPassword = await this.hashService.hash(command.password);

    const newUser = this.userFactory.createNew(
      command.username,
      command.email,
      hashedPassword,
    );

    await this.userRepository.save(newUser);
    return newUser;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAll(): Promise<User[]> {
    const ability = this.abilityFactory.createForUser();

    const users = await this.userRepository.findAll();
    return users.filter((user) => ability.can(Action.Read, user));
  }

  async remove(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    await this.userRepository.delete(id);
    return { message: 'User deleted successfully' };
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string | null,
  ): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');

    user.updateRefreshToken(refreshToken);
    await this.userRepository.save(user);
  }

  async updateProfile(command: UpdateUserCommand): Promise<User> {
    const user = await this.userRepository.findById(command.id);
    if (!user) throw new NotFoundException('User not found');
    if (command.username) {
      const existingUser = await this.userRepository.findByUsername(
        command.username,
      );
      if (existingUser && existingUser.getId() !== user.getId()) {
        throw new ConflictException('Username is already taken');
      }
      user.changeUsername(command.username);
    }
    await this.userRepository.save(user);
    return user;
  }

  async verifyUserEmail(token: string): Promise<void> {
    const user = await this.userRepository.findByVerificationToken(token);
    if (!user) throw new NotFoundException('Invalid verification token');

    user.verifyEmail(token);
    await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return this.userRepository.findByVerificationToken(token);
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.userRepository.findByResetToken(token);
  }
  async save(user: User): Promise<void> {
    await this.userRepository.save(user);
  }
}
