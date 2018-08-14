'use strict';

import * as Sequelize from 'sequelize'
import Models from './models'
const Config = require('./config');

/**
 * db connection instance
 */
const con = new Sequelize(Config.url, Config);

/**
 * models instances
 */
const models = {
    user: Models.user.register(con),
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
    },
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