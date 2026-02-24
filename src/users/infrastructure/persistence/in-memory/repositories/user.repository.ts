import { Injectable } from '@nestjs/common';
import { User as InMemoryUser } from '../entities/user.entity';
import { User } from 'src/users/domain/user';
import { UserRepository } from 'src/users/application/ports/user.repository';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, InMemoryUser>();

  constructor(private readonly userMapper: UserMapper) {}

  async save(user: User): Promise<void> {
    const persistenceData = this.userMapper.toPersistence(user);
    this.users.set(user.getId(), persistenceData as InMemoryUser);
    return Promise.resolve();
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
    return Promise.resolve();
  }

  async findAll(): Promise<User[]> {
    const entities = Array.from(this.users.values());
    return Promise.resolve(
      entities.map((entity) => this.userMapper.toDomain(entity)),
    );
  }

  async findById(id: string): Promise<User | null> {
    const entity = this.users.get(id);
    if (!entity) return null;
    return Promise.resolve(this.userMapper.toDomain(entity));
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const entity of this.users.values()) {
      if (entity.email === email) {
        return Promise.resolve(this.userMapper.toDomain(entity));
      }
    }
    return null;
  }

  async findByUsername(username: string): Promise<User | null> {
    for (const entity of this.users.values()) {
      if (entity.username === username) {
        return Promise.resolve(this.userMapper.toDomain(entity));
      }
    }
    return null;
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    for (const entity of this.users.values()) {
      if (entity.emailVerificationToken === token) {
        return Promise.resolve(this.userMapper.toDomain(entity));
      }
    }
    return null;
  }

  async findByResetToken(token: string): Promise<User | null> {
    for (const entity of this.users.values()) {
      if (entity.passwordResetToken === token) {
        return Promise.resolve(this.userMapper.toDomain(entity));
      }
    }
    return null;
  }
}
