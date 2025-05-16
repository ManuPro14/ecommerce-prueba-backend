import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from '../auth/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, passwordConfirmation } = registerDto;

    // Validar que no exista el usuario
    const userExists = await this.userModel.findOne({ email });
    if (userExists) {
      throw new BadRequestException('El usuario ya está registrado');
    }

    // Validar que las contraseñas coincidan
    if (password !== passwordConfirmation) {
      throw new BadRequestException('La confirmación de contraseña no coincide');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const user = new this.userModel({
      email,
      password: hashedPassword,
      role: 'seller', // o el valor por defecto que prefieras
    });

    await user.save();

    return this.login(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }

  async login(user: User) {
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}