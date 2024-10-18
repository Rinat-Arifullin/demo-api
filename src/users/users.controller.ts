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
import { User } from "./user.entity";
import { IUserService } from "./users.service.interface";
import { ValidateMiddleware } from "../common/validate.middlware";

@injectable()
export class UserController extends BaseController implements IUserController {
    constructor(
        @inject(TYPES.ILogger) private loggerService: ILogger,
        @inject(TYPES.UserService) private userService: IUserService
    ) {
        super(loggerService);
        this.bindRoutes([
            {
                path: '/login',
                method: 'post',
                func: this.login,
            },
            {
                path: '/register',
                method: 'post',
                func: this.register,
                middlewares: [new ValidateMiddleware(UserRegisterDto)]
            }
        ])
    }

    login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction) {
        next(new HTTPError(401, 'Ошибка авторизации', req.path))
    }

    async register({body}: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.createUser(body);

        if(!result){
            return next(new HTTPError(422, 'User already have'));
        }

        this.ok(res, {email: result.email })
    }
}