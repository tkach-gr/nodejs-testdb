import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { UserDetails } from './user/entities/user-details.entity';
import { ProductModule } from './product/product.module';
import { Product } from './product/entities/product.entity';
import { CartModule } from './cart/cart.module';
import { Cart } from './cart/entities/cart.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5435,
      username: 'admin',
      password: 'root',
      database: 'postgres',
      entities: [User, UserDetails, Product, Cart],
      synchronize: true,
    }),
    UserModule,
    ProductModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
