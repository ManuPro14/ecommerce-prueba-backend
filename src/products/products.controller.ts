import { Controller, Get, Post, Body, UseGuards, Req, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guards';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { ProductFilterDto } from './dto/product-filter.dto';

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
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard)
  findAllAdmin(@Query() filters: ProductFilterDto) {
    return this.productsService.findAllAdmin(filters);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  @Post()
  createProduct(@Body() dto: CreateProductDto, @Req() req: any) {
    return this.productsService.create(dto, req.user);
  }

  @Get('search')
  findFiltered(@Query() filter: ProductFilterDto) {
    return this.productsService.findFiltered(filter);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('/admin/all')
  getAllForAdmin(@Query('sellerId') sellerId?: string) {
    return this.productsService.findAllWithSellerFilter(sellerId);
  }
}