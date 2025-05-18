import { Controller, Get, Post, Body, UseGuards, Req, Query, Put, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guards';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { ProductFilterDto } from './dto/product-filter.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear producto (solo vendedores o administradores)' })
  @ApiResponse({ status: 201, description: 'Producto creado correctamente' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  createProduct(@Body() dto: CreateProductDto, @Req() req: any) {
    return this.productsService.create(dto, req.user.sub);
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar productos por filtros' })
  @ApiResponse({ status: 200, description: 'Listado de productos filtrados' })
  findFiltered(@Query() filter: ProductFilterDto) {
    return this.productsService.findFiltered(filter);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar productos del usuario o todos (admin)' })
  findAll(@Req() req) {
    if (req.user.role === 'admin') {
      return this.productsService.findAllAdmin({});
    }
    return this.productsService.findAllSellerProducts(req.user.sub);
  }

  @Get('/admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar todos los productos (admin)' })
  getAllForAdmin(@Query('sellerId') sellerId?: string) {
    return this.productsService.findAllWithSellerFilter(sellerId);
  }

  @Get('admin')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Listar productos con filtros (admin)' })
  findAllAdmin(@Query() filters: ProductFilterDto) {
    return this.productsService.findAllAdmin(filters);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener producto por id' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  getProductById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar producto por id' })
  @ApiResponse({ status: 200, description: 'Producto actualizado correctamente' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  updateProduct(@Param('id') id: string, @Body() dto: CreateProductDto, @Req() req: any) {
    return this.productsService.update(id, dto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar producto por id' })
  @ApiResponse({ status: 200, description: 'Producto eliminado correctamente' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  deleteProduct(@Param('id') id: string, @Req() req: any) {
    return this.productsService.delete(id, req.user.sub);
  }
}
