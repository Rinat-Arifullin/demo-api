import express, { Express } from "express"
import { Server } from 'http'
import { ILogger } from "./logger/logger.interface";
import { inject, injectable } from "inversify";
import { json } from 'body-parser'
import { TYPES } from "./types";
import { IExceptionFilter } from "./errors/exception.filter.interface";
import { IConfigService } from "./config/config.service.interface";
import { IUserController } from "./users/users.controller.interface";
import { PrismaService } from "./database/prisma.service";
import { AuthMiddleware } from "./common/auth.middlware";
import { ConfigMap } from "./constants/config";
import 'reflect-metadata'

@injectable()
export class App {
    app: Express;
    server: Server;
    port: number;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.UserController) private userController: IUserController,
        @inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.PrismaService) private prismaService: PrismaService
    ) {
        this.app = express();
        this.port = 8000;
    }

    useMiddleware():void {
        this.app.use(json())
        const authMiddleware = new AuthMiddleware(this.configService.get(ConfigMap.SECRET));
        this.app.use(authMiddleware.execute.bind(authMiddleware));
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
        await this.prismaService.connect()
        this.server = this.app.listen(this.port)
        this.logger.log(`Server started at http://localhost:${this.port}`)
    }

    public close(): void{
        this.server.close()
    }
}