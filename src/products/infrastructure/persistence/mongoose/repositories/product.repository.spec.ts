import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ClsService } from 'nestjs-cls';
import { ProductMapper } from '../mappers/product.mapper';
import { Product as MongoProduct } from '../schemas/product.schema';
import { CLS_KEYS } from 'src/common/constants/cls-keys.constant';
import { createMockProduct } from 'src/products/testing/product-builder';
import { MongooseProductRepository } from './product.repository';

describe('MongooseProductRepository', () => {
  let repository: MongooseProductRepository;

  const mockExec = jest.fn();
  const mockSession = jest.fn().mockReturnValue({ exec: mockExec });
  const mockQuery = { session: mockSession, exec: mockExec };

  const mockProductModel = {
    find: jest.fn().mockReturnValue(mockQuery),
    findOneAndUpdate: jest.fn().mockReturnValue(mockQuery),
    findByIdAndDelete: jest.fn().mockReturnValue(mockQuery),
    findById: jest.fn().mockReturnValue(mockQuery),
  };

  const mockProductMapper = {
    toDomain: jest.fn(),
    toPersistence: jest.fn(),
  };

  const mockClsService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongooseProductRepository,
        {
          provide: getModelToken(MongoProduct.name),
          useValue: mockProductModel,
        },
        {
          provide: ProductMapper,
          useValue: mockProductMapper,
        },
        {
          provide: ClsService,
          useValue: mockClsService,
        },
      ],
    }).compile();

    repository = module.get<MongooseProductRepository>(
      MongooseProductRepository,
    );
  });

  describe('findAll', () => {
    it('should return an array of domain products', async () => {
      const mockMongoDocs = [{ _id: '1', name: 'Product 1' }];
      const expectedDomainProduct = createMockProduct({ id: '1' });

      mockExec.mockResolvedValueOnce(mockMongoDocs);
      mockProductMapper.toDomain.mockReturnValue(expectedDomainProduct);
      mockClsService.get.mockReturnValue('mock-session');

      const result = await repository.findAll();

      expect(mockClsService.get).toHaveBeenCalledWith(CLS_KEYS.MONGO_SESSION);
      expect(mockProductModel.find).toHaveBeenCalled();
      expect(mockSession).toHaveBeenCalledWith('mock-session');
      expect(mockProductMapper.toDomain).toHaveBeenCalledWith(mockMongoDocs[0]);
      expect(result).toEqual([expectedDomainProduct]);
    });
  });

  describe('save', () => {
    it('should save the product to the database', async () => {
      const domainProduct = createMockProduct({ id: '1' });
      const persistenceData = { _id: '1', name: 'Laptop' };

      mockProductMapper.toPersistence.mockReturnValue(persistenceData);
      mockClsService.get.mockReturnValue('mock-session');
      mockExec.mockResolvedValueOnce(undefined);

      await repository.save(domainProduct);

      expect(mockProductMapper.toPersistence).toHaveBeenCalledWith(
        domainProduct,
      );
      expect(mockProductModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: domainProduct.getId() },
        { $set: persistenceData },
        { upsert: true, returnDocument: 'after' },
      );
    });
  });

  describe('findById', () => {
    it('should return a product if found', async () => {
      const mockMongoDoc = { _id: '1', name: 'Product 1' };
      const expectedDomainProduct = createMockProduct({ id: '1' });

      mockExec.mockResolvedValueOnce(mockMongoDoc);
      mockProductMapper.toDomain.mockReturnValue(expectedDomainProduct);

      const result = await repository.findById('1');

      expect(mockProductModel.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(expectedDomainProduct);
    });

    it('should return null if product is not found', async () => {
      mockExec.mockResolvedValueOnce(null);

      const result = await repository.findById('999');

      expect(result).toBeNull();
      expect(mockProductMapper.toDomain).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete the product by id', async () => {
      mockClsService.get.mockReturnValue('mock-session');
      mockExec.mockResolvedValueOnce(undefined);

      await repository.delete('1');

      expect(mockProductModel.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(mockSession).toHaveBeenCalledWith('mock-session');
    });
  });
});
