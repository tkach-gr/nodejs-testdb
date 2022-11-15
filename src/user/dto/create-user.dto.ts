import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  payment: string;

  @IsString()
  @IsOptional()
  address: string;
}
