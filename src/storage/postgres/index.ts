// import sequelize type
import { Sequelize as SequelizeType } from "sequelize";

// import sequelize with namespace for transactions
import { Sequelize } from "./namespace";

import { User } from "./models";

const Config = require("./config");

/**
 * db connection instance
 */
const con =
    process.env.NODE_ENV == "test"
        ? new Sequelize("database", null, null, Config)
        : new Sequelize(Config.url, Config);

/**
 * models initiations
 */
User.define(con);

const db = {
    /**
     * Sequelize Static
     */
    Sequelize: Sequelize as SequelizeType,

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
// Object.keys(Models).forEach(modelName => {
//     if (Models[modelName].associate) {
//         Models[modelName].associate(db.models);
//     }
// });

export { db };
