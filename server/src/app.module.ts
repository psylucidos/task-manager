import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: process.env.PGPASSWORD,
      username: process.env.PGUSER,
      entities: [User],
      database: process.env.DEV === 'true' ? process.env.PGDEVDATABASE : process.env.PGDATABASE,
      synchronize: true,
      logging: process.env.DBLOG === 'true',
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
