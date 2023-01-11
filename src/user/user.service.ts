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
        if(userDto.password.length < 9) throw new NotFoundException(Errormessage.Passwordlength)
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


 

}