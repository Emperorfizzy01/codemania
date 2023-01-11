import { Post } from '../../post/entities/post.entity';
export declare class Like {
    id: number;
    userId: number;
    post: Post;
    dateCreated: Date;
}
