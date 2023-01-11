import { FollowService } from 'src/follow/follow.service';
export declare class FollowController {
    private service;
    constructor(service: FollowService);
    followUser(token: string, id: number): Promise<any>;
    unfollowUser(token: string, id: number): Promise<any>;
}
