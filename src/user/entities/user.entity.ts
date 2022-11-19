import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { UserDetails } from './user-details.entity';
import { Cart } from '../../cart/entities/cart.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @OneToOne(() => UserDetails, (details) => details.user)
  details: UserDetails;

  @OneToMany(() => Cart, (cart) => cart.user)
  cart: Cart[];
}
