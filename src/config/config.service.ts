import { inject, injectable } from "inversify";
import {config, DotenvConfigOutput, DotenvParseOutput} from 'dotenv';

import { IConfigService } from "./config.service.interface";
import { TYPES } from "../types";
import { ILogger } from "../logger/logger.interface";

import 'reflect-metadata'

@injectable()
export class ConfigService implements IConfigService {
    private config: DotenvParseOutput;
    constructor(
        @inject(TYPES.ILogger) private loggerService: ILogger,
    ){
        const result: DotenvConfigOutput = config()

        if(result.error) {
            this.loggerService.error('[ConfigService] Не удалось прочитать файл .env или он отсутствует')
            return;
        }

        if(result.parsed) {
            this.loggerService.log('[ConfigService] Конфигурация .env загружена')
            this.config = result.parsed
        }

    }
    get<T extends string | number>(key: string): T {
        return this.config[key] as T
    };
    
}