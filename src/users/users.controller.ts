import { NextFunction, Request, Response } from "express";
import { BaseController } from "../common/base.controller";
import { HTTPError } from "../errors/http-error.class";
import { ILogger } from "../logger/logger.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import 'reflect-metadata'
import { IUserController } from "./users.contoller.interface";

@injectable()
export class UserController extends BaseController implements IUserController {
    constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
        super(loggerService);
        this.bindRoutes([
            {
                path: '/login',
                method: 'post',
                func: this.login
            },
            {
                path: '/register',
                method: 'post',
                func: this.register
            }
        ])
    }

    login(req: Request, res: Response, next: NextFunction) {
        next(new HTTPError(401, 'Ошибка авторизации', req.path))
    }

    register(req: Request, res: Response, next: NextFunction) {
        this.ok(res, 'register')
    }
}