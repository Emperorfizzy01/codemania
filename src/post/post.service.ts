import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Equal, In } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Post } from '../post/entities/post.entity';
import { Following } from 'src/follow/entities/userFollowing.entity';
import { CreatePostDto } from './dto/post.dto';
import { Errormessage } from 'src/Errormessage';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'src';
const bcrypt = require('bcrypt');


export class PostService {
    constructor(
      @InjectDataSource() private readonly datasource: DataSource,
      @InjectRepository(User) private readonly userModel: Repository<User>,
      @InjectRepository(Post) private readonly postModel: Repository<Post>,
      @InjectRepository(Following) private readonly followingModel: Repository<Following>
    ) {}

    async createPost(token: string, postDto: CreatePostDto): Promise<any> {
      try {
        if (!token) throw new NotFoundException(Errormessage.InvalidToken);
        const { phone } = <JwtPayload>jwt.verify(token, process.env.JWT_SECRET);
        const user = await this.userModel.findOneBy({
          phone,
        });
  
        if (!user)
          throw new NotFoundException(Errormessage.Userexist);
        const post = await this.postModel.create({
          text: postDto.text,
          user,
          dateCreated: new Date(Date.now()),
          dateUpdated: new Date(Date.now())
        })
        const newPost = await this.postModel.save(post);
        return {
          responseCode: 200,
          post: newPost,
          message: 'Post created',
        };
      } catch(err) {
        throw err
      }
    }
  
    async updatePost(token: string, postDto: CreatePostDto, id: number): Promise<any> {
      try{
        if (!token) throw new NotFoundException(Errormessage.InvalidToken);
        const { phone } = <JwtPayload>jwt.verify(token, process.env.JWT_SECRET);
        const user = await this.userModel.findOneBy({
          phone,
        });
  
        if (!user)
          throw new NotFoundException(Errormessage.Userexist);
  
       const post = await this.postModel.findOne({
          where: {
            id: id
          },
          relations: {
            user: true
          }
       })
       if(!post ) throw new NotFoundException(Errormessage.Post);
       if(post.user.id !== user.id) throw new NotFoundException(Errormessage.UnauthorisedOperation)
       post.text = postDto.text,
       post.dateUpdated = new Date(Date.now())
       const updatedPost = await this.postModel.save(post);
       return {
          responseCode: 200,
          post: updatedPost,
          message: 'Your post has been updated',
       }
      } catch(err) {
        throw err
      }
    }
  
    async deletePost(token: string, id: number): Promise<any> {
      try {
        if (!token) throw new NotFoundException(Errormessage.InvalidToken);
        const { phone } = <JwtPayload>jwt.verify(token, process.env.JWT_SECRET);
        const user = await this.userModel.findOneBy({
          phone,
        });
  
        if (!user)
          throw new NotFoundException(Errormessage.Userexist);
  
       const post = await this.postModel.findOne({
          where: {
            id: id
          },
          relations: {
            user: true
          }
       })
       if(!post ) throw new NotFoundException(Errormessage.Post);
       if(post.user.id !== user.id) throw new NotFoundException(Errormessage.UnauthorisedOperation)
        await this.postModel.delete(id);
        return {
          success: true,
          message: 'Post successfully deleted',
        };
      } catch (err) {
        throw err;
      }
    }
   
   
    async fetchPost(token: string): Promise<any> {
      try {
        if (!token) throw new NotFoundException(Errormessage.InvalidToken);
        const { phone } = <JwtPayload>jwt.verify(token, process.env.JWT_SECRET);
        const user = await this.userModel.findOneBy({
          phone,
        });
  
  
        if (!user)
          throw new NotFoundException(Errormessage.Userexist);
          const following = await this.followingModel.find({
            where: {
              userId: user.id
            },
          })
          const mapFollowing = following.map((follow) => {
              return follow.followingId
          })
          const post = await this.postModel.find({
            where: {
              user: {
                id: In(mapFollowing)
              },  
            },
            relations: {
              user: true
            }
          })
          return {
            post
          }
      } catch(err) {
        throw err
      }
    }
  
  }