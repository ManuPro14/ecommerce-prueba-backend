import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: any) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    
    const object = plainToClass(metatype, value);
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const formattedErrors = this.formatErrors(errors);
      throw new BadRequestException({
        statusCode: 400,
        message: 'Error de validación',
        errors: formattedErrors,
      });
    }
    
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: any[]) {
    return errors.map(error => {
      return {
        campo: error.property,
        errores: Object.values(error.constraints).map((message: string) => {
          // Traducción de mensajes comunes
          return message
            .replace('must be a mongodb id', 'debe ser un ID de MongoDB válido')
            .replace('must be an email', 'debe ser un correo electrónico válido')
            .replace('should not be empty', 'es requerido')
            .replace('must be a string', 'debe ser texto')
            .replace('must be a number', 'debe ser un número')
            .replace('must be a boolean', 'debe ser verdadero o falso');
        })
      };
    });
  }
}