'use strict';

import * as Boom from 'boom';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from "express-validation";
import { 
    ValidationError as SequelizeValidationError, 
    UniqueConstraintError, EmptyResultError, 
    DatabaseError, ForeignKeyConstraintError } from 'sequelize'

/**
 * catch joi ValidationError
 * @param error 
 * @param req 
 * @param res 
 * @param next 
 */
export function joiHandler(error, req: Request, res: Response, next: NextFunction) {
    let outputError = {};
    // const isDev = isDevelopment(req);

    // bad request
    if (!(error instanceof ValidationError)) {
        next(error);
        return;
    }

    outputError = {
        statusCode: error.status,
        error: error.statusText,
        message: error.message,
    };

    // if (isDev) {
        outputError = { ...outputError, errors: error.errors };
    // }

    res.status(error.status).json(outputError);
}

/**
 * catch boom error
 * @param error 
 * @param req 
 * @param res 
 * @param next 
 */
export function boomHanlder(error, req: Request, res: Response, next: NextFunction) {
    let outputError = {};
    const isDev = isDevelopment(req);

    if (!error.isBoom) {
        next(error);
        return;
    }

    error.status = error.output.statusCode;
    outputError = error.output.payload;

    if (isDev) {
        console.error(error);
    }

    res.status(error.status).json(outputError);
}

/**
 * catch internal error
 * @param error 
 * @param req 
 * @param res 
 * @param next 
 */
export function internalHandler(error, req: Request, res: Response, next: NextFunction) {
    let outputError = {};
    const isDev = isDevelopment(req);

    // internal error
    if (error.status >= 500 || !error.status) {
        outputError = {
            statusCode: 500,
            error: "Internal Server Error",
            message: "An unexpected error occurred",
        };

        console.error(error);
        if (isDev) {
            outputError = { ...outputError, message: error.message };
        }

    } else {
        next(error);
        return;
    }

    res.status(error.status || 500).json(outputError);
}

/**
 * catch sequelize's error
 * @param error 
 * @param req 
 * @param res 
 * @param next 
 */
export function sequelizeHandler(error, req: Request, res: Response, next: NextFunction) {
    switch (error.constructor) {
        case SequelizeValidationError:
            throw Boom.badRequest(error);
        case UniqueConstraintError:
            throw Boom.conflict(error);
        case EmptyResultError:
            throw Boom.notFound(error);
        case DatabaseError:
            throw Boom.badRequest(error);
        case ForeignKeyConstraintError:
            throw Boom.badData("Update or Delete violates a foreign key constraint");
        default:
            next(error)
    }
}

function isDevelopment(req: Request) {
    const env = req.app.get('env');
    const isDev = env === 'development' || env === 'test';

    return isDev;
}


