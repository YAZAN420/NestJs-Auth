import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PoliciesGuard } from 'src/iam/presentation/http/guards/policies.guard';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from 'src/products/application/products.service';
import { CreateProductCommand } from 'src/products/application/command/create-product.command';
import { UpdateProductCommand } from 'src/products/application/command/update-product.command';
import { CheckPolicies } from 'src/iam/presentation/http/decorators/check-policies.decorator';
import { Action } from 'src/iam/domain/enums/action.enum';
import { Product } from 'src/products/domain/product';
import { ClsService } from 'nestjs-cls';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { CachePublic } from 'src/common/presentation/decorators/cache-public.decorator';

@UseGuards(PoliciesGuard)
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cls: ClsService,
  ) {}

  @CheckPolicies([
    (authPort, user) => authPort.checkPermission(user, Action.Create, Product),
  ])
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const user = this.cls.get<ActiveUserData>('User');
    const product = await this.productsService.create(
      user,
      new CreateProductCommand(
        createProductDto.name,
        createProductDto.description,
        createProductDto.price,
      ),
    );
    return {
      message: 'Product created successfully',
      data: product,
    };
  }
  @CheckPolicies([
    (authPort, user) => authPort.checkPermission(user, Action.Read, Product),
  ])
  @Get()
  @CachePublic()
  async findAll() {
    const products = await this.productsService.findAll();
    return {
      message: 'Products fetched successfully',
      data: products,
    };
  }

  @CheckPolicies([
    (authPort, user) => authPort.checkPermission(user, Action.Read, Product),
  ])
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(id);
    return {
      message: 'Product fetched successfully',
      data: product,
    };
  }

  @CheckPolicies([
    (authPort, user) => authPort.checkPermission(user, Action.Update, Product),
  ])
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const user = this.cls.get<ActiveUserData>('User');
    const newProduct = await this.productsService.update(
      user,
      new UpdateProductCommand(
        id,
        updateProductDto.name,
        updateProductDto.description,
        updateProductDto.price,
      ),
    );
    return {
      message: 'Product updated successfully',
      data: newProduct,
    };
  }

  @CheckPolicies([
    (authPort, user) => authPort.checkPermission(user, Action.Delete, Product),
  ])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = this.cls.get<ActiveUserData>('User');
    await this.productsService.remove(user, id);
    return {
      message: 'Product deleted successfully',
    };
  }
}
