import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class Cart {
  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User, (user) => user.cart)
  user: User;

  @PrimaryColumn()
  productId: number;

  @ManyToOne(() => Product)
  product: Product;

  @Column()
  amount: number;
}
