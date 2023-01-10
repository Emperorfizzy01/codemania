import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
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
    @InjectRepository(Post) private readonly postModel: Repository<Post>
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
     const updatedPost = await this.postModel.save(post)
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
}