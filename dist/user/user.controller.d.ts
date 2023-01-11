import { CreateUserDto } from './dto/user.dto';
import { UserService } from 'src/user/user.service';
export declare class UserController {
    private service;
    constructor(service: UserService);
    signUp(createDto: CreateUserDto): Promise<any>;
    login(createDto: CreateUserDto): Promise<any>;
    getUser(id: number): Promise<any>;
}
