"use strict";

import * as admin from "firebase-admin";
import * as Boom from "boom";
import { NextFunction, Response } from "express";
import { Scope } from "../enums/scope";
import { AuthRequest } from "../interfaces";

class Auth {
    /**
     *
     * @param scopes if no scope is passed, it will not be validated
     */
    constructor(private scopes?: Scope[]) {}

    /**
     * Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
     * when decoded successfully, the ID Token content will be added as `req.credentials`.
     * @param req
     * @param res
     * @param next
     */
    private async authFirebase(req: AuthRequest, res, next: NextFunction) {
        try {
            const { authorization } = req.headers;

            if (!authorization) {
                next(Boom.unauthorized("Token not informed"));
                return;
            }

            const decodedToken = await admin
                .auth()
                .verifyIdToken(this.getToken(authorization));

            if (this.scopes.length) {
                this.checkScope(this.scopes, decodedToken.scope);
            }

            req.credentials = decodedToken;

            next();
        } catch (error) {
            next(error.isBoom ? error : Boom.forbidden("invalid token"));
        }
    }

    /**
     * check if user has scope
     * @param scopes
     * @param userScope
     */
    private checkScope(scopes: Scope[], userScope: object) {
        if (!userScope) {
            throw Boom.badRequest("user do not have scope");
        }

        const hasScope = scopes.some(scope => {
            return userScope[scope] === true;
        });

        if (!hasScope) {
            throw Boom.forbidden("insufficient privileges for this route");
        }
    }

    get config() {
        if (process.env.NODE_ENV === "test") {
            return this.authTest.bind(this);
        }

        return this.authFirebase.bind(this);
    }

    private getToken(authorization: string): string {
        const bearer = authorization.split("Bearer ");
        return (bearer[1] || bearer[0]).trim();
    }

    /**
     * Express middleware for test
     * @param req
     * @param res
     * @param next
     */
    private authTest(req, res: Response, next: NextFunction) {
        const { authorization } = req.headers;

        if (!authorization) {
            next(Boom.unauthorized("Token not informed"));
            return;
        }

        req.credentials = {
            uid: this.getToken(authorization),
            scope: {
                user: true,
                admin: true
            }
        };

        next();
    }
}

/**
 *
 * @param scopes if no scope is passed, it will not be validated
 */
function init(...scopes: Scope[]) {
    return new Auth(scopes).config;
}

export default init;
