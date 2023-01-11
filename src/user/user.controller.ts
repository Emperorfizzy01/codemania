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
  import { CreateUserDto } from './dto/user.dto';
  import { UserService } from 'src/user/user.service';

@Controller('')
export class UserController {
constructor(private service: UserService) {}

  @Post('/signup')
  signUp(@Body() createDto: CreateUserDto): Promise<any> {
    return this.service.createAccount(createDto);
  }

  @Post('/login')
  login(@Body() createDto: CreateUserDto): Promise<any> {
    return this.service.login(createDto);
  }

  @Get('/user/:id')
  getUser(@Param('id') id: number): Promise<any> {
    return this.service.getUser(id)
  }

  // @Post('/follow/:id')
  // followUser(@Headers('token') token: string, @Param('id') id: number): Promise<any> {
  //   return this.service.followUser(token, id);
  // }

  // @Post('/unfollow/:id')
  // unfollowUser(@Headers('token') token: string, @Param('id') id: number): Promise<any> {
  //   return this.service.unfollowUser(token, id);
  // }

  // @Post('/like/:id')
  // likePost(@Headers('token') token: string, @Param('id') id: number): Promise<any> {
  //   return this.service.likePost(token, id);
  // }

  // @Post('/unlike/:id')
  // unlikePost(@Headers('token') token: string, @Param('id') id: number): Promise<any> {
  //   return this.service.unlikePost(token, id);
  // }

}