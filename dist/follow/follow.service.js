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
exports.FollowService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const userFollowers_entity_1 = require("./entities/userFollowers.entity");
const userFollowing_entity_1 = require("./entities/userFollowing.entity");
const Errormessage_1 = require("../Errormessage");
const jwt = __importStar(require("jsonwebtoken"));
let FollowService = class FollowService {
    constructor(datasource, userModel, followerModel, followingModel) {
        this.datasource = datasource;
        this.userModel = userModel;
        this.followerModel = followerModel;
        this.followingModel = followingModel;
    }
    async followUser(token, id) {
        try {
            if (!token)
                throw new common_1.NotFoundException(Errormessage_1.Errormessage.InvalidToken);
            const { phone } = jwt.verify(token, process.env.JWT_SECRET);
            const userFollower = await this.userModel.findOneBy({
                phone,
            });
            if (!userFollower)
                throw new common_1.NotFoundException(Errormessage_1.Errormessage.Userexist);
            const userFollowing = await this.userModel.findOneBy({
                id
            });
            if (!userFollowing)
                throw new common_1.NotFoundException(Errormessage_1.Errormessage.Userexist);
            if (userFollower.id == id)
                throw new common_1.NotFoundException(Errormessage_1.Errormessage.InvalidOperation);
            const getUserFollowers = await this.followerModel.findOne({
                where: {
                    userId: id,
                    followerId: userFollower.id
                }
            });
            if (!getUserFollowers) {
                const followedUser = this.followerModel.create({
                    userId: userFollowing.id,
                    followerId: userFollower.id,
                    dateCreated: new Date(Date.now()),
                });
                const followingUser = this.followingModel.create({
                    userId: userFollower.id,
                    followingId: userFollowing.id,
                    dateCreated: new Date(Date.now()),
                });
                const follower = await this.followerModel.save(followedUser);
                const following = await this.followingModel.save(followingUser);
                return {
                    responseCode: 200,
                    message: "User followed",
                    follower,
                    following
                };
            }
            throw new common_1.NotFoundException(Errormessage_1.Errormessage.AlreadyFollowing);
        }
        catch (err) {
            throw err;
        }
    }
    async unfollowUser(token, id) {
        try {
            if (!token)
                throw new common_1.NotFoundException(Errormessage_1.Errormessage.InvalidToken);
            const { phone } = jwt.verify(token, process.env.JWT_SECRET);
            const userFollower = await this.userModel.findOneBy({
                phone,
            });
            if (!userFollower)
                throw new common_1.NotFoundException(Errormessage_1.Errormessage.Userexist);
            const userFollowing = await this.userModel.findOneBy({
                id
            });
            if (!userFollowing)
                throw new common_1.NotFoundException(Errormessage_1.Errormessage.Userexist);
            const getUserFollowers = await this.followerModel.findOne({
                where: {
                    userId: id,
                    followerId: userFollower.id
                }
            });
            const getUserFollowing = await this.followingModel.findOne({
                where: {
                    userId: userFollower.id,
                    followingId: id
                }
            });
            if (!getUserFollowers)
                throw new common_1.NotFoundException(Errormessage_1.Errormessage.NotFollowing);
            const deleteUserFollower = await this.followerModel.delete(getUserFollowers.id);
            const deleteUserFollowing = await this.followingModel.delete(getUserFollowing.id);
            return {
                success: true,
                message: "User successfully unfollowed"
            };
        }
        catch (err) {
            throw err;
        }
    }
};
FollowService = __decorate([
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(userFollowers_entity_1.Follower)),
    __param(3, (0, typeorm_1.InjectRepository)(userFollowing_entity_1.Following)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FollowService);
exports.FollowService = FollowService;
//# sourceMappingURL=follow.service.js.map