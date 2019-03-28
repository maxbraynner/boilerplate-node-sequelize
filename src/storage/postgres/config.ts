require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const defaultConfig = {
    logging: false,
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
        // logging: true,
        // sync: {alter: true},
    },
    test: {
        ...defaultConfig,
        dialect: 'sqlite',
        storage: './__tests__/database.sqlite'
    },
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