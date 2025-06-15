const { addProduct, getProducts, getProductByUuid, updateProduct, deleteProduct } = require('../product_repository');
const { Product, sequelize } = require('../../models'); 

// Mock the Product model and sequelize for isolated testing
jest.mock('../../models', () => ({
    sequelize: {
        transaction: jest.fn(() => ({
            commit: jest.fn(),
            rollback: jest.fn(),
        })),
    },
    Product: {
        create: jest.fn(),
        count: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(), // Note: In Sequelize, 'destroy' is typically used for deletion
    },
}));

describe('Product Repository', () => {
    beforeEach(() => {
        // Clear all mock calls before each test
        jest.clearAllMocks();
    });

    // Test for addProduct
    describe('addProduct', () => {
        it('should add a new product and commit the transaction', async () => {
            const mockProduct = { uuid: 'ced0349f-2877-4ea8-b60d-a4463d29c098', name: 'Test Product', price: 100.0, quantity: 10.0 };
            Product.create.mockResolvedValue(mockProduct);
            const result = await addProduct('Test Product', 100.0, 10.0);
            expect(sequelize.transaction).toHaveBeenCalledTimes(1);
            expect(Product.create).toHaveBeenCalledWith(
                { name: 'Test Product', price: 100.0, quantity: 10.0 },
                { transaction: expect.any(Object) }
            );
            expect(sequelize.transaction().commit).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockProduct);
        });

        it('should rollback the transaction if adding product fails', async () => {
            const error = new Error('Database error');
            Product.create.mockRejectedValue(error);
            await expect(addProduct('Test Product', 100.0, 10.0)).rejects.toThrow(error);
            expect(sequelize.transaction).toHaveBeenCalledTimes(1);
            expect(Product.create).toHaveBeenCalledTimes(1);
            expect(sequelize.transaction().rollback).toHaveBeenCalledTimes(1);
        });
    });

    // Test for getProducts
    describe('getProducts', () => {
        it('should return a list of products with count', async () => {
            const mockProducts = [{ uuid: 'ced0349f-2877-4ea8-b60d-a4463d29c098', name: 'Test Product' }, { uuid: 'c6792b3c-fea0-42a2-bdd6-ecd91ddd0458', name: 'Test Product Two' }];
            Product.count.mockResolvedValue(2);
            Product.findAll.mockResolvedValue(mockProducts);

            const result = await getProducts({ page: 0, limit: 10 });

            expect(Product.count).toHaveBeenCalledTimes(1);
            expect(Product.findAll).toHaveBeenCalledWith({
                attributes: ['uuid', 'name', 'price', 'quantity'],
                order: [['createdAt', 'DESC']],
                limit: 10,
                offset: 0,
            });
            expect(result).toEqual({ count: 10, records: mockProducts });
        });

        it('should handle pagination correctly', async () => {
            Product.count.mockResolvedValue(10);
            Product.findAll.mockResolvedValue([]);

            await getProducts({ page: 1, limit: 5 });

            expect(Product.findAll).toHaveBeenCalledWith(expect.objectContaining({
                limit: 5,
                offset: 5, // (page * limit) = 1 * 5
            }));
        });

        it('should reject if fetching products fails', async () => {
            const error = new Error('Fetch error');
            Product.count.mockRejectedValue(error);
            await expect(getProducts({ page: 0, limit: 10 })).rejects.toThrow(error);
        });
    });

    // Test for getProductByUuid
    describe('getProductByUuid', () => {
        it('should return a product by its UUID', async () => {
            const mockProduct = [{ uuid: 'ced0349f-2877-4ea8-b60d-a4463d29c098', name: 'Test Product' }];
            Product.findAll.mockResolvedValue(mockProduct);

            const result = await getProductByUuid('ced0349f-2877-4ea8-b60d-a4463d29c098');

            expect(Product.findAll).toHaveBeenCalledWith({
                attributes: ['uuid', 'name', 'price', 'quantity'],
                where: { uuid: 'abc' },
            });
            expect(result).toEqual(mockProduct);
        });

        it('should return an empty array if product not found', async () => {
            Product.findAll.mockResolvedValue([]);

            const result = await getProductByUuid('non-existent-uuid');

            expect(result).toEqual([]);
        });

        it('should reject if fetching product by UUID fails', async () => {
            const error = new Error('UUID fetch error');
            Product.findAll.mockRejectedValue(error);

            await expect(getProductByUuid('abc')).rejects.toThrow(error);
        });
    });

    // Test for updateProduct
    describe('updateProduct', () => {
        it('should update a product and commit the transaction', async () => {
            const updatedData = { price: 150.0 };
            Product.update.mockResolvedValue([1]); // Sequelize update returns [numberOfAffectedRows]

            const result = await updateProduct('ced0349f-2877-4ea8-b60d-a4463d29c098', updatedData);

            expect(sequelize.transaction).toHaveBeenCalledTimes(1);
            expect(Product.update).toHaveBeenCalledWith(updatedData, {
                where: { uuid: 'ced0349f-2877-4ea8-b60d-a4463d29c098' },
                transaction: expect.any(Object),
            });
            expect(sequelize.transaction().commit).toHaveBeenCalledTimes(1);
            expect(result).toBe('UPDATED');
        });

        it('should rollback the transaction if updating product fails', async () => {
            const error = new Error('Update error');
            Product.update.mockRejectedValue(error);
            await expect(updateProduct('ced0349f-2877-4ea8-b60d-a4463d29c098', { price: 150.0 })).rejects.toThrow(error);
            expect(sequelize.transaction).toHaveBeenCalledTimes(1);
            expect(Product.update).toHaveBeenCalledTimes(1);
            expect(sequelize.transaction().rollback).toHaveBeenCalledTimes(1);
        });
    });

    // Test for deleteProduct
    describe('deleteProduct', () => {
        it('should delete a product and commit the transaction', async () => {
            Product.delete.mockResolvedValue(1); // Assuming delete returns number of destroyed rows

            const result = await deleteProduct('ced0349f-2877-4ea8-b60d-a4463d29c098');

            expect(sequelize.transaction).toHaveBeenCalledTimes(1);
            expect(Product.delete).toHaveBeenCalledWith({ // Note: Product.destroy is more common in Sequelize
                where: { uuid: 'ced0349f-2877-4ea8-b60d-a4463d29c098' },
                transaction: expect.any(Object),
            });
            expect(sequelize.transaction().commit).toHaveBeenCalledTimes(1);
            expect(result).toBe('DELETED');
        });

        it('should rollback the transaction if deleting product fails', async () => {
            const error = new Error('Delete error');
            Product.delete.mockRejectedValue(error);

            await expect(deleteProduct('def')).rejects.toThrow(error);

            expect(sequelize.transaction).toHaveBeenCalledTimes(1);
            expect(Product.delete).toHaveBeenCalledTimes(1);
            expect(sequelize.transaction().rollback).toHaveBeenCalledTimes(1);
        });
    });
});