import { Product } from 'src/products/domain/product';

export abstract class ProductRepository {
  abstract findAll(): Promise<Product[]>;

  abstract save(product: Product): Promise<void>;
  abstract delete(id: string): Promise<void>;

  abstract findById(id: string): Promise<Product | null>;
}
