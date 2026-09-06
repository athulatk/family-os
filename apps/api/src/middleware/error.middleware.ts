import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app.error";

export function errorMiddleware(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if(error instanceof AppError){
        return res.status(error.statusCode).json({
            error: {
                message: error.message,
                code: error.statusCode
            }
        })
    }

    return res.status(500).json({
        error: {
            message: "Something went wrong",
            code: 500
        }
    })
    
}