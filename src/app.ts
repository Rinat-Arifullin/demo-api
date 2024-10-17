import express, { Express } from "express"
import { Server } from 'http'
import { UserController } from "./users/users.controller";
import { ILogger } from "./logger/logger.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "./types";
import { IExceptionFilter } from "./errors/exception.filter.interface";
import 'reflect-metadata'

@injectable()
export class App {
    app: Express;
    server: Server;
    port: number;


    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.UserController) private userController: UserController,
        @inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter) {
        this.app = express();
        this.port = 8000;
    }

    useRoutes() {
        this.app.use('/users', this.userController.router)
    }

    useExceptionFilters() {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter))
    }

    public async init() {
        this.useRoutes()
        this.useExceptionFilters()
        this.server = this.app.listen(this.port)
        this.logger.log(`Server started at http://localhost:${this.port}`)
    }
}