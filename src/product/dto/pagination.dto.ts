import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsInt()
  @IsPositive()
  limit?: number;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsInt()
  @IsPositive()
  offset?: number;
}
