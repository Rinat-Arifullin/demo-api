import { NextFunction, Request, Response } from "express";
import { BaseController } from "../common/base.controller";
import { HTTPError } from "../errors/http-error.class";
import { ILogger } from "../logger/logger.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import 'reflect-metadata'
import { IUserController } from "./users.controller.interface";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-registr.dto";
import { IUserService } from "./users.service.interface";
import { ValidateMiddleware } from "../common/validate.middlware";
import { sign } from 'jsonwebtoken'
import { IConfigService } from "../config/config.service.interface";
import { ConfigMap } from "../constants/config";
import { GuardMiddleware } from "../common/guard.middlware";

@injectable()
export class UserController extends BaseController implements IUserController {
    constructor(
        @inject(TYPES.ILogger) private loggerService: ILogger,
        @inject(TYPES.UserService) private userService: IUserService,
        @inject(TYPES.ConfigService) private configService: IConfigService
    ) {
        super(loggerService);
        this.bindRoutes([
            {
                path: '/login',
                method: 'post',
                func: this.login,
                middlewares: [new ValidateMiddleware(UserLoginDto)]
            },
            {
                path: '/register',
                method: 'post',
                func: this.register,
                middlewares: [new ValidateMiddleware(UserRegisterDto)]
            },
            {
                path: '/info',
                method: 'get',
                func: this.info,
                middlewares: [new GuardMiddleware()]
            }
        ])
    }

    async login({body: user}: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
        const isValidUser = await this.userService.validateUser(user);

        if(!isValidUser){
            return next(new HTTPError(422, 'Неверно введен логин или пароль', 'UserController login'))
        }

        const secret = this.configService.get(ConfigMap.SECRET)
        
        this.loggerService.log('Успешный логин')
        const jwt = await this.signJWT(user.email, secret)
        this.ok(res, { jwt })
    }

    async register({body}: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.createUser(body);

        if(!result){
            return next(new HTTPError(422, 'Такой пользователь уже существует', 'UserController register'));
        }


        this.ok(res, {email: result.email , id: result.id})
    }

    async info({user}:Request, res:Response, next: NextFunction):Promise<void> {
        const userInfo = await this.userService.getUserInfo(user)

        if(userInfo){
            this.ok(res, {email: userInfo.email, id: userInfo.id})
            return;
        }
    }

    private signJWT(email: string, secret: string): Promise<string> {
        return new Promise<string>((resolve, reject)=>{
            sign({
                email,
                iat: Math.floor(Date.now() / 1000)
            }, 
            secret, 
            { 
                algorithm: "HS256"
            },
            (err, token) => {
                if(err) {
                    reject(err)
                }
                resolve(token as string)
            },
            )
        })
    }
}