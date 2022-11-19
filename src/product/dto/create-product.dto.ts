import { IsInt, IsPositive, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

  @Transform(({ value }) => Number(value))
  @IsPositive()
  @IsInt()
  price: number;
}
