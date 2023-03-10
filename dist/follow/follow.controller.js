"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowController = void 0;
const common_1 = require("@nestjs/common");
const follow_service_1 = require("./follow.service");
let FollowController = class FollowController {
    constructor(service) {
        this.service = service;
    }
    followUser(token, id) {
        return this.service.followUser(token, id);
    }
    unfollowUser(token, id) {
        return this.service.unfollowUser(token, id);
    }
};
__decorate([
    (0, common_1.Post)('/follow/:id'),
    __param(0, (0, common_1.Headers)('token')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], FollowController.prototype, "followUser", null);
__decorate([
    (0, common_1.Post)('/unfollow/:id'),
    __param(0, (0, common_1.Headers)('token')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], FollowController.prototype, "unfollowUser", null);
FollowController = __decorate([
    (0, common_1.Controller)(''),
    __metadata("design:paramtypes", [follow_service_1.FollowService])
], FollowController);
exports.FollowController = FollowController;
//# sourceMappingURL=follow.controller.js.map