import { DataSource, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Follower } from 'src/follow/entities/userFollowers.entity';
import { Following } from 'src/follow/entities/userFollowing.entity';
export declare class FollowService {
    private readonly datasource;
    private readonly userModel;
    private readonly followerModel;
    private readonly followingModel;
    constructor(datasource: DataSource, userModel: Repository<User>, followerModel: Repository<Follower>, followingModel: Repository<Following>);
    followUser(token: string, id: number): Promise<any>;
    unfollowUser(token: string, id: number): Promise<any>;
}
