import { Request, Response, NextFunction } from "express";
import { IMiddleware } from "./middleware.interface";

export class GuardMiddleware implements IMiddleware{
    execute(req: Request, res: Response, next: NextFunction): void {
        if(!req.user){
            res.status(401)
            res.json({
                message: 'Вы не авторизованы'
            })
        } else {
            next()
        }
    }
}