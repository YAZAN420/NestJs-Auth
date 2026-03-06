import { ProductFactory } from './product.factory';
import { Product } from '../product';
import { v7 as uuidv7 } from 'uuid';

jest.mock('uuid', () => ({
  v7: jest.fn(),
}));

describe('ProductFactory', () => {
  let factory: ProductFactory;

  beforeEach(() => {
    factory = new ProductFactory();
    jest.clearAllMocks();
  });

  describe('createNew', () => {
    it('should create a new Product with generated UUID and current dates', () => {
      const mockId = '018b8f2c-b261-71e9-a411-123456789abc';
      const mockDate = new Date('2026-03-06T12:00:00Z');

      (uuidv7 as jest.Mock).mockReturnValue(mockId);
      jest.useFakeTimers().setSystemTime(mockDate);

      const name = 'Test Product';
      const description = 'This is a test product';
      const price = 99.99;
      const _createdBy = 'admin-user';

      const product = factory.createNew(name, description, price, _createdBy);

      expect(uuidv7).toHaveBeenCalledTimes(1);
      expect(product).toBeInstanceOf(Product);
      expect(product).toEqual({
        id: mockId,
        name,
        description,
        price,
        _createdBy,
        createdAt: mockDate,
        updatedAt: mockDate,
      });

      jest.useRealTimers();
    });
  });

  describe('reconstitute', () => {
    it('should reconstruct an existing Product with exactly the provided data', () => {
      const id = 'existing-id-123';
      const name = 'Existing Product';
      const description = 'Existing description';
      const price = 150;
      const _createdBy = 'user-1';
      const createdAt = new Date('2026-01-01T10:00:00Z');
      const updatedAt = new Date('2026-02-01T10:00:00Z');

      const product = factory.reconstitute(
        id,
        name,
        description,
        price,
        _createdBy,
        createdAt,
        updatedAt,
      );

      expect(uuidv7).not.toHaveBeenCalled();
      expect(product).toBeInstanceOf(Product);
      expect(product).toEqual({
        id,
        name,
        description,
        price,
        _createdBy,
        createdAt,
        updatedAt,
      });
    });
  });
});
