import { Test, TestingModule } from '@nestjs/testing';
import { ProductMapper } from './product.mapper';
import { ProductFactory } from 'src/products/domain/factories/product.factory';
import { createMockProduct } from 'src/products/testing/product-builder';
import { Product as MongoProduct } from '../schemas/product.schema';
describe('ProductMapper', () => {
  let mapper: ProductMapper;

  const mockProductFactory = {
    reconstitute: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductMapper,
        {
          provide: ProductFactory,
          useValue: mockProductFactory,
        },
      ],
    }).compile();

    mapper = module.get<ProductMapper>(ProductMapper);
  });

  describe('toDomain', () => {
    it('should map MongoProduct to Domain Product when createdBy is a string (unpopulated)', () => {
      const mockMongoDoc: MongoProduct = {
        _id: 'mongo-id-123',
        name: 'Test Product',
        description: 'Test Desc',
        price: 200,
        createdBy: 'user-id-456',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      };

      const expectedDomainProduct = createMockProduct({ id: 'mongo-id-123' });
      mockProductFactory.reconstitute.mockReturnValue(expectedDomainProduct);

      const result = mapper.toDomain(mockMongoDoc);

      expect(mockProductFactory.reconstitute).toHaveBeenCalledWith(
        mockMongoDoc._id,
        mockMongoDoc.name,
        mockMongoDoc.description,
        mockMongoDoc.price,
        'user-id-456',
        mockMongoDoc.createdAt,
        mockMongoDoc.updatedAt,
      );
      expect(result).toBe(expectedDomainProduct);
    });

    it('should map MongoProduct to Domain Product when createdBy is an object (populated)', () => {
      const mockPopulatedUser = {
        _id: 'user-id-456',
        username: 'Yazan',
        email: 'test@test.com',
        password: 'dummy-hashed-password',
        role: 'user',
        isTwoFactorAuthenticationEnabled: false,
        isEmailVerified: true,
      };

      const mockMongoDoc = {
        _id: 'mongo-id-123',
        name: 'Test Product',
        description: 'Test Desc',
        price: 200,
        createdBy: mockPopulatedUser,
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      } as MongoProduct;

      const expectedDomainProduct = createMockProduct({ id: 'mongo-id-123' });
      mockProductFactory.reconstitute.mockReturnValue(expectedDomainProduct);

      const result = mapper.toDomain(mockMongoDoc);

      expect(mockProductFactory.reconstitute).toHaveBeenCalledWith(
        mockMongoDoc._id,
        mockMongoDoc.name,
        mockMongoDoc.description,
        mockMongoDoc.price,
        'user-id-456',
        mockMongoDoc.createdAt,
        mockMongoDoc.updatedAt,
      );
      expect(result).toBe(expectedDomainProduct);
    });
  });

  describe('toPersistence', () => {
    it('should map Domain Product to a plain object for Mongoose', () => {
      const domainProduct = createMockProduct({
        id: 'prod-1',
        name: 'Domain Product',
        description: 'Domain Desc',
        price: 150,
        createdBy: 'user-1',
      });

      const result = mapper.toPersistence(domainProduct);

      expect(result).toEqual({
        _id: 'prod-1',
        name: 'Domain Product',
        description: 'Domain Desc',
        price: 150,
        createdBy: 'user-1',
      });
    });
  });
});
