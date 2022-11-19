import { Injectable } from '@nestjs/common';
import { CreateCartProductDto } from './dto/create-cart-product.dto';
import { Cart } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async addProduct(createCartDto: CreateCartProductDto) {
    const cart = new Cart();
    cart.userId = createCartDto.userId;
    cart.productId = createCartDto.productId;
    cart.amount = createCartDto.amount;
    await this.cartRepository.save(cart);
  }

  async findAllByUser(userId: number) {
    const user = await this.userRepository
      .createQueryBuilder()
      .leftJoinAndSelect('User.cart', 'Cart')
      .select(['User', 'Cart.product', 'Cart.amount'])
      .leftJoinAndSelect('Cart.product', 'Product')
      .where('User.id = :userId', { userId })
      .getOne();

    return user.cart;
  }

  async removeProduct(userId: number, productId: number) {
    await this.cartRepository
      .createQueryBuilder()
      .delete()
      .where('userId = :userId AND productId = :productId', {
        userId,
        productId,
      })
      .execute();

    return { status: true };
  }

  async removeAllProducts(userId: number) {
    await this.cartRepository
      .createQueryBuilder()
      .delete()
      .where('userId = :userId', {
        userId,
      })
      .execute();

    return { status: true };
  }
}
