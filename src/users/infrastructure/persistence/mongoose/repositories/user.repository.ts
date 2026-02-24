import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User as MongoUser } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/domain/user';
import { UserRepository } from 'src/users/application/ports/user.repository';
import { UserMapper } from '../mappers/user.mapper';
@Injectable()
export class MongooseUserRepository implements UserRepository {
  constructor(
    @InjectModel(MongoUser.name) private readonly userModel: Model<MongoUser>,
    private readonly userMapper: UserMapper,
  ) {}
  async findAll(): Promise<User[]> {
    const docs = await this.userModel.find().exec();
    return docs.map((doc) => this.userMapper.toDomain(doc));
  }
  async save(user: User): Promise<void> {
    const persistenceData = this.userMapper.toPersistence(user);
    await this.userModel
      .findOneAndUpdate(
        { _id: user.getId() },
        { $set: persistenceData },
        { upsert: true, new: true },
      )
      .exec();
  }
  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }
  async findById(id: string): Promise<User | null> {
    const doc = await this.userModel.findById(id).exec();
    if (!doc) return null;
    return this.userMapper.toDomain(doc);
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.userModel.findOne({ email }).exec();
    if (!doc) return null;
    return this.userMapper.toDomain(doc);
  }

  async findByUsername(username: string): Promise<User | null> {
    const doc = await this.userModel.findOne({ username }).exec();
    if (!doc) return null;
    return this.userMapper.toDomain(doc);
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    const doc = await this.userModel
      .findOne({ emailVerificationToken: token })
      .exec();
    if (!doc) return null;
    return this.userMapper.toDomain(doc);
  }
  async findByResetToken(token: string): Promise<User | null> {
    const doc = await this.userModel
      .findOne({ passwordResetToken: token })
      .exec();
    if (!doc) return null;
    return this.userMapper.toDomain(doc);
  }
}
