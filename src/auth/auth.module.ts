import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { PasswordConfirmationValidator } from './validators/password-confirmation.validator';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule,
  ],
  providers: [
    AuthService,
    PasswordConfirmationValidator,
  ],
  controllers: [AuthController],
  exports: [AuthService], 
})
export class AuthModule {}