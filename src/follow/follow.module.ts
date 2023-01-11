import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Follower } from 'src/follow/entities/userFollowers.entity';
import { Following } from 'src/follow/entities/userFollowing.entity';
import { FollowService } from 'src/follow/follow.service';
import { FollowController } from 'src/follow/follow.controller';
import { Like } from '../like/entities/like.entity';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Follower,
      Following
    ]),
    ConfigModule.forRoot(),
  ],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}