import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { UserDetails } from './entities/user-details.entity';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(UserDetails)
    private usersDetailsRepository: Repository<UserDetails>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    await this.usersRepository.save(user);

    const userDetails = new UserDetails();
    userDetails.phone = createUserDto.phone;
    userDetails.payment = createUserDto.payment;
    userDetails.address = createUserDto.address;
    userDetails.user = user;
    await this.usersDetailsRepository.save(userDetails);

    return createUserDto;
  }

  async findAll(pagination: PaginationDto) {
    const limit = pagination.limit;
    const offset = pagination.offset;

    const [users, count] = await this.usersRepository
      .createQueryBuilder()
      // .leftJoinAndSelect('User.details', 'UserDetails')
      .limit(pagination.limit)
      .offset(pagination.offset)
      .getManyAndCount();

    return { users, count, limit, offset };
  }

  async findOne(id: number) {
    const entity = await this.usersRepository.findOne({
      where: { id },
      relations: ['details'],
    });
    if (!entity) {
      throw new BadRequestException('invalid user id');
    }

    return entity;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let status = false;

    try {
      await queryRunner.manager
        .createQueryBuilder()
        .update(User)
        .set({ name: updateUserDto.name, email: updateUserDto.email })
        .where('id = :id', { id })
        .execute();

      await queryRunner.manager
        .createQueryBuilder()
        .update(UserDetails)
        .set({
          phone: updateUserDto.phone,
          payment: updateUserDto.payment,
          address: updateUserDto.address,
        })
        .where('userId = :id', { id })
        .execute();

      await queryRunner.commitTransaction();

      status = true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return { status };
  }

  async remove(id: number) {
    await this.usersDetailsRepository
      .createQueryBuilder()
      .delete()
      .where('userId = :id', { id })
      .execute();

    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where({ id })
      .execute();

    return { status: true };
  }
}
