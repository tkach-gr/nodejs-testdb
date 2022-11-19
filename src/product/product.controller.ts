import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from './dto/pagination.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const id = await this.productService.create(createProductDto);
    return { id };
  }

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    return await this.productService.findAll(pagination);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.productService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      await this.productService.update(id, updateProductDto);
      return { status: true };
    } catch (e) {
      throw new BadRequestException(e.toString());
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      await this.productService.remove(id);
      return { status: true };
    } catch (e) {
      throw new BadRequestException(e.toString());
    }
  }
}
