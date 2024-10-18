import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-registr.dto";
import { User } from "./user.entity";

export interface IUserService {
    createUser(dto: UserRegisterDto): Promise<User | null>;
    validateUser(dto: UserLoginDto): Promise<boolean>;
}