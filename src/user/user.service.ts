import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Equal, In } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Like } from '../like/entities/like.entity';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { Errormessage } from 'src/Errormessage';
import * as jwt from 'jsonwebtoken'
import { JwtPayload } from 'src';
const bcrypt = require('bcrypt');


export class UserService {
  constructor(
    @InjectDataSource() private readonly datasource: DataSource,
    @InjectRepository(User) private readonly userModel: Repository<User>,
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