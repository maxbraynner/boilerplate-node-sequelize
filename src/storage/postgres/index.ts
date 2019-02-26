"use strict";

import * as Sequelize from "sequelize";
import Models from "./models";
import { namespace } from "./namespace";
const Config = require("./config");

/**
 * Configure namespace
 */
Sequelize.useCLS(namespace as any);

/**
 * db connection instance
 */
const con =
    process.env.NODE_ENV == "test"
        ? new Sequelize("database", null, null, Config)
        : new Sequelize(Config.url, Config);

/**
 * models instances
 */
const models = {
    user: Models.user.register(con)
};

const db = {
    /**
     * Sequelize Static
     */
    Sequelize,

    /**
     * Models instances
     */
    models,

    /**
     * readonly sequelize connection instance
     */
    get con() {
        return con;
    },

    /**
     * isReady performs a connection test and synchronizes the tables
     */
    async isReady() {
        await con.authenticate();
        // await con.sync({
        //     alter: true,
        // });
    }
};

/**
 * make all the associations shine
 */
Object.keys(Models).forEach(modelName => {
    if (Models[modelName].associate) {
        Models[modelName].associate(db.models);
    }
});

export { db };
