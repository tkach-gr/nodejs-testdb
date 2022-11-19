import { Controller, Get, Post, Param } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post(':userId')
  async create(@Param('userId') userId: number) {
    return await this.orderService.create(userId);
  }

  @Get()
  async findAll() {
    return await this.orderService.findAll();
  }

  @Get(':userId')
  async findAllByUser(@Param('userId') userId: number) {
    return await this.orderService.findAllByUser(userId);
  }
}
