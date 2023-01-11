import { CreatePostDto } from './dto/post.dto';
import { PostService } from './post.service';
export declare class PostController {
    private service;
    constructor(service: PostService);
    createPost(token: string, createDto: CreatePostDto): Promise<any>;
    updatePost(token: string, createDto: CreatePostDto, id: any): Promise<any>;
    deletePost(token: string, id: number): Promise<any>;
    fetchPost(token: string): Promise<any>;
}
