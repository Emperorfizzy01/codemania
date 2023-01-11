import { User } from '../../user/entities/user.entity';
import { Like } from '../../like/entities/like.entity';
export declare class Post {
    id: number;
    text: string;
    user: User;
    likes: Like[];
    dateCreated: Date;
    dateUpdated: Date;
}
