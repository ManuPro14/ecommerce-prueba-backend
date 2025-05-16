import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'El SKU es obligatorio' })
  sku: string;

  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  quantity: number;

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsNotEmpty({ message: 'El precio es obligatorio' })
  price: number;
}