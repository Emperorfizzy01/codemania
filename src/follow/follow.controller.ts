import {
    Body,
    Controller,
    Post,
    Put,
    Headers,
    Get,
    Param,
    UploadedFile,
    UseInterceptors,
    Res,
    Delete,
    Patch,
  } from '@nestjs/common';
  import { FollowService } from 'src/follow/follow.service';

@Controller('')
export class FollowController {
constructor(private service: FollowService) {}

  @Post('/follow/:id')
  followUser(@Headers('token') token: string, @Param('id') id: number): Promise<any> {
    return this.service.followUser(token, id);
  }

  @Post('/unfollow/:id')
  unfollowUser(@Headers('token') token: string, @Param('id') id: number): Promise<any> {
    return this.service.unfollowUser(token, id);
  }


}