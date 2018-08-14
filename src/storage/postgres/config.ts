'use strict';

const env = process.env.NODE_ENV || 'development';

// Required to enable migrations in development
if (env === 'development') {
    // eslint-disable-next-line
    require('dotenv').config();
}

const operatorsAliases = require('./operators');

const defaultConfig = {
    operatorsAliases,
    dialect: 'postgres',
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeSeedMeta',
    url: process.env.POSTGRES_URL || process.env.DATABASE_URL,
    define: {
        freezeTableName: true,
    },

    paginate: {
        default: 10,
        max: 50,
    },
};

const sequelizeConfig = {
    development: {
        ...defaultConfig,
        benchmark: true,
        // sync: {alter: true},
    },
    test: defaultConfig,
    production: {
        ...defaultConfig,
        ssl: true,
        dialectOptions: {
            ssl: {
                require: true,
            },
        },
    },
};

module.exports = sequelizeConfig[env];