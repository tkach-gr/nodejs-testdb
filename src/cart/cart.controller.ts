import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartProductDto } from './dto/create-cart-product.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async addProduct(@Body() dto: CreateCartProductDto) {
    try {
      await this.cartService.addProduct(dto);
      return { status: true };
    } catch (e) {
      throw new BadRequestException(e.toString());
    }
  }

  @Get(':userId')
  async findAllByUser(@Param('userId') userId: number) {
    return await this.cartService.findAllByUser(userId);
  }

  @Delete(':userId/:productId')
  async removeProduct(
    @Param('userId') userId: number,
    @Param('productId') productId: number,
  ) {
    return await this.cartService.removeProduct(userId, productId);
  }

  @Delete(':userId')
  async removeAllProducts(@Param('userId') userId: number) {
    return await this.cartService.removeAllProducts(userId);
  }
}
