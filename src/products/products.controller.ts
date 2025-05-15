import { Controller, Get, Post, Body, UseGuards, Req, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductFiltersDto } from './dto/product-filters.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createProductDto: CreateProductDto, @Req() req) {
    return this.productsService.create(createProductDto, req.user.sub);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    if (req.user.role === 'admin') {
      return this.productsService.findAllAdmin({});
    }
    return this.productsService.findAllSellerProducts(req.user.sub);
  }

  @Get('admin')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  findAllAdmin(@Query() filters: ProductFiltersDto) {
    return this.productsService.findAllAdmin(filters);
  }
}