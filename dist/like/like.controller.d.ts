import { LikeService } from 'src/like/like.service';
export declare class LikeController {
    private service;
    constructor(service: LikeService);
    likePost(token: string, id: number): Promise<any>;
    unlikePost(token: string, id: number): Promise<any>;
}
