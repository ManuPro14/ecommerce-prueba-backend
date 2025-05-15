import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'passwordConfirmation', async: false })
export class PasswordConfirmationValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    return 'La confirmación de contraseña no coincide con la contraseña';
  }
}