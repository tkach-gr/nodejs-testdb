import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { UserDetails } from './user-details.entity';

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
}
