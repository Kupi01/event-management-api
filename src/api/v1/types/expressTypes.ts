import { Request, Response, NextFunction } from "express";

/**
 * Standard Express middleware function type
 */
export type MiddlewareFunction = (
    req: Request,
    res: Response,
    next: NextFunction
) => void;
