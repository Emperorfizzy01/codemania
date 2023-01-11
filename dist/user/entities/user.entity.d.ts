import { Post } from '../../post/entities/post.entity';
export declare class User {
    id: number;
    firstname: string;
    surname: string;
    phone: string;
    password: string;
    post: Post[];
    dateCreated: Date;
}
