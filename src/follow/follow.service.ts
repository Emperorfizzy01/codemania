import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Equal, In } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Follower } from 'src/follow/entities/userFollowers.entity';
import { Following } from 'src/follow/entities/userFollowing.entity';
import { Errormessage } from 'src/Errormessage';
import * as jwt from 'jsonwebtoken'
import { JwtPayload } from 'src';



export class FollowService {
  constructor(
    @InjectDataSource() private readonly datasource: DataSource,
    @InjectRepository(User) private readonly userModel: Repository<User>,
    @InjectRepository(Follower) private readonly followerModel: Repository<Follower>,
    @InjectRepository(Following) private readonly followingModel: Repository<Following>,
  ) {}


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

  // async likePost(token: string, id: number): Promise<any> {
  //   try {
  //     if (!token) throw new NotFoundException(Errormessage.InvalidToken);
  //     const { phone } = <JwtPayload>jwt.verify(token, process.env.JWT_SECRET);
  //     const user = await this.userModel.findOneBy({
  //       phone,
  //     });

  //     if (!user)
  //       throw new NotFoundException(Errormessage.Userexist);
  //     const post = await this.postModel.findOne({
  //       where: {
  //         id: Equal(id)
  //       },
  //       relations: {
  //         likes: true
  //       }
  //     })
  //     if(!post ) throw new NotFoundException(Errormessage.Post);
  //     const alreadyLiked = await this.likeModel.findOne({
  //       where: {
  //         userId: user.id,
  //         post : { id: post.id }
  //       }
  //     })
  //    if(!alreadyLiked) {
  //     const likePost = await this.likeModel.create({
  //       userId: user.id,
  //       post,
  //       dateCreated: new Date(Date.now())
  //     })
  //     const likedPost = await this.likeModel.save(likePost)
  //     return {
  //       responseCode: 200,
  //       likedPost,
  //       message: "You liked the post"
  //     }
  //    }
  //    throw new NotFoundException(Errormessage.AlreadyLiked)
      
  //   } catch(err) {
  //     throw err
  //   }
  // }

  // async unlikePost(token: string, id: number): Promise<any> {
  //   try {
  //     if (!token) throw new NotFoundException(Errormessage.InvalidToken);
  //     const { phone } = <JwtPayload>jwt.verify(token, process.env.JWT_SECRET);
  //     const user = await this.userModel.findOneBy({
  //       phone,
  //     });

  //     if (!user)
  //       throw new NotFoundException(Errormessage.Userexist);
  //       const post = await this.postModel.findOne({
  //         where: {
  //           id: Equal(id)
  //         },
  //         relations: {
  //           likes: true
  //         }
  //       })
  //       if(!post ) throw new NotFoundException(Errormessage.Post);
  //       const alreadyLiked = await this.likeModel.findOne({
  //         where: {
  //           userId: user.id,
  //           post : { id: post.id }
  //         }
  //       })
  //       if(!alreadyLiked) throw new NotFoundException(Errormessage.NotLike)
  //       const unlikePost = await this.likeModel.delete(alreadyLiked.id)

  //       return {
  //         success: true,
  //         message: "You unliked the post"
  //       }
  //   } catch(err) {
  //     throw err
  //   }
  // }

}