import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDetails } from './entities/user-details.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserDetails])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
