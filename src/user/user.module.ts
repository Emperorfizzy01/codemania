import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { Post } from './entities/post.entity';
import { Follower } from '../user/entities/userFollowers.entity';
import { Following } from '../user/entities/userFollowing.entity';
import { Like } from '../user/entities/like.entity';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Post,
      Follower,
      Following,
      Like
    ]),
    ConfigModule.forRoot(),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}