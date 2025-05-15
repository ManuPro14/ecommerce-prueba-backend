import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';
import { PasswordConfirmationValidator } from '../validators/password-confirmation.validator';

export class RegisterDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @IsNotEmpty({ message: 'La confirmación de contraseña es requerida' })
  @Validate(PasswordConfirmationValidator, ['password'])
  passwordConfirmation: string;
}