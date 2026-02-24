import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductRepository } from 'src/products/application/ports/product.repository';
import { Product } from 'src/products/domain/product';
import { ProductMapper } from '../mappers/product.mapper';
import { Product as MongoProduct } from '../schemas/product.schema';

export class MongooseProductRepository implements ProductRepository {
  constructor(
    @InjectModel(MongoProduct.name)
    private readonly productModel: Model<MongoProduct>,
    private readonly productMapper: ProductMapper,
  ) {}
  async findAll(): Promise<Product[]> {
    const docs = await this.productModel.find().exec();
    return docs.map((doc) => this.productMapper.toDomain(doc));
  }
  async save(product: Product): Promise<void> {
    const persistenceData = this.productMapper.toPersistence(product);
    await this.productModel
      .findOneAndUpdate(
        { _id: product.getId() },
        { $set: persistenceData },
        { upsert: true, returnDocument: 'after' },
      )
      .exec();
  }
  async delete(id: string): Promise<void> {
    await this.productModel.findByIdAndDelete(id).exec();
  }
  async findById(id: string): Promise<Product | null> {
    const doc = await this.productModel.findById(id).exec();
    if (!doc) return null;
    return this.productMapper.toDomain(doc);
  }
}
