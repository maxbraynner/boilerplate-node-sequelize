"use strict";

import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as logger from "morgan";
import * as cors from "cors";
import * as helmet from "helmet";
import { notFound } from "boom";
import {
    boomHanlder,
    internalHandler,
    joiHandler,
    sequelizeHandler
} from "./config/errorHandler";
import routes from "./routes";

class App {
    // ref to Express instance
    private express: express.Application;

    constructor() {
        // Run configuration methods on the Express instance.
        this.express = express();
        this.middleware();
        this.routes();

        // error handler must be after routers
        this.errorHandler();
    }

    get config() {
        return this.express;
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(logger("dev"));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(cookieParser());
        this.express.use(cors());
        this.express.use(helmet());
    }

    // Configure API endpoints.
    private routes(): void {
        this.express.use("/", routes);
    }

    // Configure error handler
    private errorHandler(): void {
        this.express.use(this.notFound);
        this.express.use(joiHandler);
        this.express.use(sequelizeHandler); // this must be before boomHanlder
        this.express.use(boomHanlder);
        this.express.use(internalHandler);
    }

    // catch 404 and forward to error handler
    private notFound(req, res, next) {
        next(notFound());
    }
}

export default new App().config;
