import express, { Express } from "express"
import { Server } from 'http'
import { ILogger } from "./logger/logger.interface";
import { inject, injectable } from "inversify";
import { json } from 'body-parser'
import { TYPES } from "./types";
import { IExceptionFilter } from "./errors/exception.filter.interface";
import 'reflect-metadata'
import { IConfigService } from "./config/config.service.interface";
import { IUserController } from "./users/users.controller.interface";

@injectable()
export class App {
    app: Express;
    server: Server;
    port: number;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.UserController) private userController: IUserController,
        @inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
        @inject(TYPES.ConfigService) private configService: IConfigService
    ) {
        this.app = express();
        this.port = 8000;
    }

    useMiddleware():void {
        this.app.use(json())
    }

    useRoutes() {
        this.app.use('/users', this.userController.router)
    }

    useExceptionFilters() {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter))
    }

    public async init() {
        this.useMiddleware()
        this.useRoutes()
        this.useExceptionFilters()
        this.server = this.app.listen(this.port)
        this.logger.log(`Server started at http://localhost:${this.port}`)
    }
}