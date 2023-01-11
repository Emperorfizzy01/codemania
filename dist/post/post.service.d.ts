import { DataSource, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Post } from '../post/entities/post.entity';
import { Following } from 'src/follow/entities/userFollowing.entity';
import { CreatePostDto } from './dto/post.dto';
export declare class PostService {
    private readonly datasource;
    private readonly userModel;
    private readonly postModel;
    private readonly followingModel;
    constructor(datasource: DataSource, userModel: Repository<User>, postModel: Repository<Post>, followingModel: Repository<Following>);
    createPost(token: string, postDto: CreatePostDto): Promise<any>;
    updatePost(token: string, postDto: CreatePostDto, id: number): Promise<any>;
    deletePost(token: string, id: number): Promise<any>;
    fetchPost(token: string): Promise<any>;
}
