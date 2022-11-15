import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserDetails } from './entities/user-details.entity';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class UserService {
  constructor(
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
    userDetails.phone = createUserDto.email;
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
      .limit(pagination.limit)
      .offset(pagination.offset)
      .getManyAndCount();

    return { users, count, limit, offset };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
