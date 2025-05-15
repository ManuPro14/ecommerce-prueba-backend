import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ProductsModule,
    UsersModule,
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    }
  ]
})
export class AppModule {}