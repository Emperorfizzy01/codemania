import {
    Body,
    Controller,
    Post,
    Get,
    Param,
    Headers
  } from '@nestjs/common';
  import { LikeService } from 'src/like/like.service';

@Controller('')
export class LikeController {
constructor(private service: LikeService) {}

  @Post('/like/:id')
  likePost(@Headers('token') token: string, @Param('id') id: number): Promise<any> {
    return this.service.likePost(token, id);
  }

  @Post('/unlike/:id')
  unlikePost(@Headers('token') token: string, @Param('id') id: number): Promise<any> {
    return this.service.unlikePost(token, id);
  }

}