import { Transform } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class CreateCartProductDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  userId: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  productId: number;

  @Transform(({ value }) => Number(value))
  @IsPositive()
  @IsInt()
  amount: number;
}
