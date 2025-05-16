import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().select('-password');
  }
}