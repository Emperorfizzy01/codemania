"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const like_entity_1 = require("../like/entities/like.entity");
const Errormessage_1 = require("../Errormessage");
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt = require('bcrypt');
let UserService = class UserService {
    constructor(datasource, userModel, likeModel) {
        this.datasource = datasource;
        this.userModel = userModel;
        this.likeModel = likeModel;
    }
    async createAccount(userDto) {
        try {
            const userExist = await this.userModel.findOneBy({
                phone: userDto.phone,
            });
            if (!userExist) {
                if (userDto.password.length < 9)
                    throw new common_1.NotFoundException(Errormessage_1.Errormessage.Passwordlength);
                if (userDto.password == userDto.confirmPassword) {
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
                        message: 'Account successfully created ',
                    };
                }
                throw new common_1.NotFoundException(Errormessage_1.Errormessage.Unmatchpassword);
            }
            throw new common_1.NotFoundException(Errormessage_1.Errormessage.UserExist);
        }
        catch (err) {
            throw err;
        }
    }
    async login(userDto) {
        try {
            const userExist = await this.userModel.findOneBy({
                phone: userDto.phone,
            });
            if (!userExist)
                throw new common_1.NotFoundException(Errormessage_1.Errormessage.IncorrectData);
            const match = await bcrypt.compare(userDto.password, userExist.password);
            if (!match)
                throw new common_1.NotFoundException(Errormessage_1.Errormessage.IncorrectData);
            const payload = { id: userExist.id, phone: userExist.phone };
            const options = { expiresIn: '1d' };
            const secret = process.env.JWT_SECRET;
            const token = jwt.sign(payload, secret, options);
            return {
                responseCode: 200,
                success: true,
                accessToken: token,
            };
        }
        catch (err) {
            throw err;
        }
    }
    async getUser(id) {
        try {
            const user = await this.userModel.findOne({
                where: {
                    id
                },
                relations: {
                    post: {
                        likes: true
                    }
                }
            });
            return user;
        }
        catch (err) {
            throw err;
        }
    }
};
UserService = __decorate([
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(like_entity_1.Like)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map