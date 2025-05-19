import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  async create(createProductDto: CreateProductDto, sellerId: string): Promise<Product> {
    if (!sellerId) throw new Error('Missing sellerId for product creation');

    const newProduct = new this.productModel({
      ...createProductDto,
      seller: sellerId,
    });

    return newProduct.save();
  }

  async findAllSellerProducts(sellerId: string): Promise<Product[]> {
    return this.productModel.find({ seller: sellerId }).exec();
  }

  async findAllAdmin(filters: ProductFilterDto): Promise<Product[]> {
    const query: any = {};

    if (filters.sellerId) query.seller = filters.sellerId;
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = filters.minPrice;
      if (filters.maxPrice) query.price.$lte = filters.maxPrice;
    }

    return this.productModel.find(query).populate('seller', 'email -_id').exec();
  }

  async findFiltered(filter: ProductFilterDto) {
    const query: any = {};
    if (filter.name) {
      query.name = { $regex: filter.name, $options: 'i' };
    }
    if (filter.sku) {
      query.sku = filter.sku;
    }
    if (filter.minPrice || filter.maxPrice) {
      query.price = {};
      if (filter.minPrice) query.price.$gte = filter.minPrice;
      if (filter.maxPrice) query.price.$lte = filter.maxPrice;
    }

    return this.productModel.find(query).exec();
  }

  async findAllWithSellerFilter(sellerId?: string) {
    const query = sellerId ? { seller: sellerId } : {};
    return this.productModel.find(query).exec();
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).populate('seller', 'email -_id');
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async update(id: string, dto: CreateProductDto, sellerId: string): Promise<Product> {
    const product = await this.productModel.findById(id);
    if (!product) throw new Error('Product not found');

    const currentSeller = product.seller?.toString();

    if (currentSeller && currentSeller !== sellerId) {
      throw new Error('Not authorized to update this product');
    }

    const updated = await this.productModel.findByIdAndUpdate(
      id,
      { ...dto, seller: currentSeller || sellerId },
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw new Error('Product not found after update');
    }
    
    return updated;
  }

  async delete(id: string, sellerId: string): Promise<Product> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    if (product.seller && product.seller.toString() !== sellerId) {
      throw new Error('Not authorized to delete this product');
    }
    await product.deleteOne();
    return product;
  }

  async findAllPublic() : Promise<Product[]> {
    return this.productModel.find({}).populate('seller', 'email -_id').exec();
  }
}
