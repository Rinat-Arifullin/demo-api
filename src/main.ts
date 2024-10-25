import { Container, ContainerModule, interfaces } from "inversify";
import { App } from "./app";

import { IExceptionFilter } from "./errors/exception.filter.interface";
import { ExceptionFilter } from "./errors/exception.filter";

import { LoggerService } from "./logger/logger.service";
import { ILogger } from "./logger/logger.interface";

import { IUserController } from "./users/users.controller.interface";
import { UserController } from "./users/users.controller";
import { IUserService } from "./users/users.service.interface";
import { UserService } from "./users/users.service";
import { IConfigService } from "./config/config.service.interface";
import { ConfigService } from "./config/config.service";

import { TYPES } from "./types";
import { PrismaService } from "./database/prisma.service";
import { IUsersRepository } from "./users/users.repository.interface";
import { UsersRepository } from "./users/users.repository";

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope()
    bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope()
    bind<IUserController>(TYPES.UserController).to(UserController).inSingletonScope()
    bind<IUserService>(TYPES.UserService).to(UserService)
    bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope()
    bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope()
    bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope()
    bind<App>(TYPES.Application).to(App).inSingletonScope()
})
 
async function bootstrap() {
    const appContainer = new Container();
    appContainer.load(appBindings)
    const app = appContainer.get<App>(TYPES.Application);
    await app.init()
    return { appContainer, app }
}

export const boot = bootstrap()