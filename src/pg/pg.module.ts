import { Global, Module } from '@nestjs/common';
import { PgRepository } from './pg.repository';
import { PG_REPOSITORY } from '../constants';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: PG_REPOSITORY,
      useFactory: async () => {
        return await PgRepository.createConnection();
      },
    },
  ],
  exports: [PG_REPOSITORY],
})
export class PgModule {}
