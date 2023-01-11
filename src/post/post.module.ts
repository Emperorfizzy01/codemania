import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Following } from 'src/follow/entities/userFollowing.entity';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Post,
      Following
    ]),
    ConfigModule.forRoot(),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}