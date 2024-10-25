import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { ILogger } from "../logger/logger.interface";
import 'reflect-metadata'

@injectable()
export class PrismaService {
    client: PrismaClient;

    constructor(
        @inject(TYPES.ILogger) private loggerService: ILogger,
    ){
        this.client = new PrismaClient()
    }

    async connect(): Promise<void> {
        try{
            await this.client.$connect();
            this.loggerService.log('[PrismaService] Success connected to db')
        } catch(error){
            if(error instanceof Error){
                this.loggerService.error('[PrismaService] Connection error', error.message)
            }
        }        
    }

    async disconnect(): Promise<void> {
        this.loggerService.log('[PrismaService] Disconnect db')
        await this.client.$disconnect();
    }
}