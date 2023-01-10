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
  import { CreatePostDto } from './dto/post.dto';
  import { UserService } from './user.service';

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

  @Post('/post')
  createPost(@Headers('token') token: string, @Body() createDto: CreatePostDto): Promise<any> {
    return this.service.createPost(token, createDto);
  }

  @Put('/post/:id')
  updatePost(@Headers('token') token: string,  @Body() createDto: CreatePostDto, @Param('id') id,): Promise<any> {
    return this.service.updatePost(token, createDto, id)
  }

  @Delete('/delete-post/:id')
  deletePost(@Headers('token') token: string, @Param('id') id: number): Promise<any> {
    return this.service.deletePost(token, id);
  }

  @Post('/follow/:id')
  FollowUser(@Headers('token') token: string, @Param('id') id: number): Promise<any> {
    return this.service.followUser(token, id);
  }
}