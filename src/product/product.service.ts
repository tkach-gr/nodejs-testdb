import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = new Product();
    product.name = createProductDto.name;
    product.price = createProductDto.price;

    await this.productRepository.save(product);

    return product.id;
  }

  async findAll(pagination: PaginationDto) {
    const limit = pagination.limit;
    const offset = pagination.offset;

    const [users, count] = await this.productRepository
      .createQueryBuilder()
      .limit(pagination.limit)
      .offset(pagination.offset)
      .getManyAndCount();

    return { users, count, limit, offset };
  }

  async findOne(id: number) {
    const entity = await this.productRepository.findOne({
      where: { id },
    });
    if (!entity) {
      throw new BadRequestException('invalid product id');
    }

    return entity;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = new Product();
    product.id = id;
    product.name = updateProductDto.name;
    product.price = updateProductDto.price;
    await this.productRepository.update(id, product);
  }

  async remove(id: number) {
    await this.productRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();
  }
}
