import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ClsService } from 'nestjs-cls';
import { ActiveUserData } from 'src/iam/authentication/interfaces/active-user-data.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import { CaslAbilityFactory } from 'src/iam/authorization/casl/casl-ability.factory';
import { Action } from 'src/iam/authorization/enums/action.enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly abilityFactory: CaslAbilityFactory,
    private readonly cls: ClsService,
  ) {}
  create(createProductDto: CreateProductDto) {
    const user = this.cls.get<ActiveUserData>('User');

    const newProduct = new this.productModel({
      ...createProductDto,
      createdBy: user.id,
    });

    return newProduct.save();
  }

  findAll() {
    return 'aaa';
    // const ability = this.abilityFactory.createForUser();
    // return await this.productModel.accessibleBy(ability, Action.Read).exec();
  }

  async findOne(id: number) {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const ability = this.abilityFactory.createForUser();

    if (ability.cannot(Action.Read, product)) {
      throw new ForbiddenException(
        'You do not have permission to read this product',
      );
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const ability = this.abilityFactory.createForUser();

    if (ability.cannot(Action.Update, product)) {
      throw new ForbiddenException(
        'You do not have permission to update this product',
      );
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();

    return updatedProduct;
  }

  async remove(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const ability = this.abilityFactory.createForUser();

    if (ability.cannot(Action.Delete, product)) {
      throw new ForbiddenException(
        'You do not have permission to delete this product',
      );
    }

    await this.productModel.findByIdAndDelete(id).exec();
    return { message: 'Product deleted successfully' };
  }
}
