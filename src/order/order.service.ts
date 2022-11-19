import { BadRequestException, Injectable } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Cart } from '../cart/entities/cart.entity';

@Injectable()
export class OrderService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  async create(userId: number) {
    const user = await this.userRepository
      .createQueryBuilder()
      .leftJoinAndSelect('User.details', 'UserDetails')
      .leftJoinAndSelect('User.cart', 'Cart')
      .leftJoinAndSelect('Cart.product', 'Product')
      .where('User.id = :userId', { userId })
      .getOne();

    if (!user) {
      throw new BadRequestException('invalid user id');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let orderId: number;

    try {
      const order = new Order();
      order.user = user;
      order.deliveryAddress = user.details.address;
      order.products = user.cart.map((item) => item.product);
      order.totalPrice = user.cart.reduce(
        (prev, curr) => prev + curr.product.price * curr.amount,
        0,
      );
      await this.orderRepository.save(order);

      await this.cartRepository
        .createQueryBuilder()
        .delete()
        .where('userId = :userId', {
          userId,
        })
        .execute();

      await queryRunner.commitTransaction();

      orderId = order.id;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return { id: orderId };
  }

  async findAll() {
    return await this.orderRepository
      .createQueryBuilder()
      .select()
      .leftJoinAndSelect('Order.user', 'User')
      .leftJoinAndSelect('Order.products', 'Product')
      .getMany();
  }

  async findAllByUser(userId: number) {
    return await this.orderRepository
      .createQueryBuilder()
      .select()
      .leftJoinAndSelect('Order.products', 'Product')
      .where('Order.userId = :userId', { userId })
      .getMany();
  }
}
