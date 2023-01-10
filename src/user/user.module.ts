import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { Post } from './entities/post.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Post
    ]),
    ConfigModule.forRoot(),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}