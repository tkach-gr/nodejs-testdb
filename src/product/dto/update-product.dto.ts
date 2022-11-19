import { IsInt, IsPositive, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProductDto {
  @IsString()
  name: string;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsPositive()
  price: number;
}
