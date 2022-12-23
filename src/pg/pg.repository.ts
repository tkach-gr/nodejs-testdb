import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { User } from '../user/entities/user.entity';
import { PaginationDto } from '../user/dto/pagination.dto';
import { UserDetails } from '../user/entities/user-details.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class PgRepository {
  private readonly client: Client;

  public static async createConnection() {
    const client = new Client({
      host: 'localhost',
      port: 5434,
      database: 'postgres',
      user: 'admin',
      password: 'root',
    });
    await client.connect();

    return new PgRepository(client);
  }

  private constructor(pgClient: Client) {
    this.client = pgClient;
  }

  public async create(dto: CreateUserDto) {
    const { rows } = await this.client.query(`
      INSERT INTO users (name, email)
      VALUES ($1, $2);

      INSERT INTO user_details (phone, payment, address, user_id)
      VALUES ($3, $4, $5, curval(users_id_seq));
    `);
  }

  public async countAllUsers() {
    const { rows } = await this.client.query(`SELECT COUNT(id) from users`);

    const count = Number(rows[0]?.count);

    return count || 0;
  }

  public async findAll(pagination: PaginationDto) {
    const { rows } = await this.client.query(
      `
      SELECT * 
      FROM users
      LIMIT $1
      OFFSET $2;
    `,
      [pagination.limit, pagination.offset],
    );

    const users = [];
    for (const row of rows) {
      const user = new User();
      user.id = row.id;
      user.name = row.name;
      user.email = row.email;

      users.push(user);
    }

    return users;
  }

  public async findOne(id: number) {
    const { rows } = await this.client.query(
      `
          SELECT
              users.id as id,
              users.name as name,
              users.email as email,
              user_details.id as details_id,
              user_details.phone as phone,
              user_details.payment as payment,
              user_details.address as address
          FROM users
              LEFT JOIN user_details on user_details.id = users.id
          WHERE users.id = $1;
    `,
      [id],
    );

    const [item] = rows;
    if (!item) {
      return null;
    }

    const details = new UserDetails();
    details.id = item['details_id'];
    details.phone = item['phone'];
    details.payment = item['payment'];
    details.address = item['address'];

    const user = new User();
    user.id = item['id'];
    user.name = item['name'];
    user.email = item['email'];
    user.details = details;

    return user;
  }
}
