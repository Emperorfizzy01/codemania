import { DataSource, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Like } from 'src/like/entities/like.entity';
import { Post } from 'src/post/entities/post.entity';
export declare class LikeService {
    private readonly datasource;
    private readonly userModel;
    private readonly likeModel;
    private readonly postModel;
    constructor(datasource: DataSource, userModel: Repository<User>, likeModel: Repository<Like>, postModel: Repository<Post>);
    likePost(token: string, id: number): Promise<any>;
    unlikePost(token: string, id: number): Promise<any>;
}
