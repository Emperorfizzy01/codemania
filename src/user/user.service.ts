import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Equal } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Like } from '../user/entities/like.entity';
import { Follower } from '../user/entities/userFollowers.entity';
import { Following } from '../user/entities/userFollowing.entity';
import { Post } from '../user/entities/post.entity';
import { CreateUserDto } from './dto/user.dto';
import { CreatePostDto } from './dto/post.dto';
import { Errormessage } from 'src/Errormessage';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'src';
const bcrypt = require('bcrypt');


export class UserService {
  constructor(
    @InjectDataSource() private readonly datasource: DataSource,
    @InjectRepository(User) private readonly userModel: Repository<User>,
    @InjectRepository(Post) private readonly postModel: Repository<Post>,
    @InjectRepository(Follower) private readonly followerModel: Repository<Follower>,
    @InjectRepository(Following) private readonly followingModel: Repository<Following>,
    @InjectRepository(Like) private readonly likeModel: Repository<Like>
  ) {}
  async createAccount(userDto: CreateUserDto): Promise<any> {
    try {
      const userExist = await this.userModel.findOneBy({
        phone: userDto.phone,
      });
      if(!userExist) {
         if(userDto.password == userDto.confirmPassword) {
          const user = await this.userModel.create({
            password: userDto.password,
            firstname: userDto.firstname,
            surname: userDto.surname,
            phone: userDto.phone,
            dateCreated: new Date(Date.now()),
          });
          const saltRounds = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(user.password, saltRounds);
          user.password = hashPassword;
          const newUser = await this.userModel.save(user);
          return {
            responseCode: 201,
            success: true,
            message:
              'Account successfully created ',
          };
         }
         throw new NotFoundException(Errormessage.Unmatchpassword);
      }
      throw new NotFoundException(Errormessage.UserExist);
    } catch (err) {
      throw err;
    }
  }

  async login(userDto: CreateUserDto): Promise<any> {
    try {
      const userExist = await this.userModel.findOneBy({
        phone: userDto.phone,
      });
      if (!userExist) throw new NotFoundException(Errormessage.IncorrectData);
      const match = await bcrypt.compare(userDto.password, userExist.password);
      if (!match) throw new NotFoundException(Errormessage.IncorrectData);
      // Create a token
      const payload = { id: userExist.id, phone: userExist.phone };
      const options = { expiresIn: '1d' };
      const secret = process.env.JWT_SECRET;
      const token = jwt.sign(payload, secret, options);
      return {
        responseCode: 200,
        success: true,
        accessToken: token,
      };
    } catch (err) {
      throw err;
    }
  }

  async getUser(id: number): Promise<any> {
    try{
     const user = await this.userModel.findOne({
        where: {
          id
        },
        relations: {
          post: {
            likes: true
          }
        }
     })
     return user
    } catch(err) {
      throw err
    }
  }

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

  async followUser(token: string, id: number): Promise<any> {
    try{
      if (!token) throw new NotFoundException(Errormessage.InvalidToken);
      const { phone } = <JwtPayload>jwt.verify(token, process.env.JWT_SECRET);
      const userFollower = await this.userModel.findOneBy({
        phone,
      });

      if (!userFollower)
        throw new NotFoundException(Errormessage.Userexist);
      
      const userFollowing = await this.userModel.findOneBy({
        id
      })
      if (!userFollowing)
        throw new NotFoundException(Errormessage.Userexist);
      if(userFollower.id == id) throw new NotFoundException(Errormessage.InvalidOperation)
      const getUserFollowers = await this.followerModel.findOne({
        where: {
          userId: id,
          followerId: userFollower.id
        }
      })
      if(!getUserFollowers) {
        const followedUser = this.followerModel.create({
          userId: userFollowing.id,
          followerId: userFollower.id,
          dateCreated: new Date(Date.now()),
        })
        const followingUser = this.followingModel.create({
          userId: userFollower.id,
          followingId: userFollowing.id,
          dateCreated: new Date(Date.now()),
        })
  
     const follower = await this.followerModel.save(followedUser);
     const following = await this.followingModel.save(followingUser)
     return {
       responseCode: 200,
       message: "User followed",
       follower,
       following
     }
      }
      throw new NotFoundException(Errormessage.AlreadyFollowing)
    } catch(err) {
      throw err
    }
  }

  async unfollowUser(token: string, id: number): Promise<any> {
    try{
      if (!token) throw new NotFoundException(Errormessage.InvalidToken);
      const { phone } = <JwtPayload>jwt.verify(token, process.env.JWT_SECRET);
      const userFollower = await this.userModel.findOneBy({
        phone,
      });

      if (!userFollower)
        throw new NotFoundException(Errormessage.Userexist);
      
      const userFollowing = await this.userModel.findOneBy({
        id
      })
      if (!userFollowing)
        throw new NotFoundException(Errormessage.Userexist);
        const getUserFollowers = await this.followerModel.findOne({
          where: {
            userId: id,
            followerId: userFollower.id
          }
        })
        const getUserFollowing = await this.followingModel.findOne({
          where: {
            userId: userFollower.id,
            followingId: id
          }
        })
        if(!getUserFollowers) throw new NotFoundException(Errormessage.NotFollowing)
        const deleteUserFollower = await this.followerModel.delete(getUserFollowers.id)
        const deleteUserFollowing = await this.followingModel.delete(getUserFollowing.id)

        return {
          success: true,
          message: "User successfully unfollowed"
        }
    } catch(err) {
      throw err
    }
  }

  async likePost(token: string, id: number): Promise<any> {
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
          id: Equal(id)
        },
        relations: {
          likes: true
        }
      })
      if(!post ) throw new NotFoundException(Errormessage.Post);
      const alreadyLiked = await this.likeModel.findOne({
        where: {
          userId: user.id,
          post : { id: post.id }
        }
      })
     if(!alreadyLiked) {
      const likePost = await this.likeModel.create({
        userId: user.id,
        post,
        dateCreated: new Date(Date.now())
      })
      const likedPost = await this.likeModel.save(likePost)
      return {
        responseCode: 200,
        likedPost,
        message: "You liked the post"
      }
     }
     throw new NotFoundException(Errormessage.AlreadyLiked)
      
    } catch(err) {
      throw err
    }
  }

}