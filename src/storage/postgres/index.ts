import { Sequelize as SequelizeType } from "sequelize";
// import sequelize with namespace for transactions
import { Sequelize } from "./namespace";
import { User } from "./models";
const Config = require("./config");

class DataBase {
    private _connection;

    public constructor() {
        this.connect();
        this.defineModels();
        this.associateModels();
    }

    public get connection(): SequelizeType {
        return this._connection as SequelizeType;
    }

    public async isReady() {
        await this._connection.authenticate();
    }

    private connect() {
        const isTest = process.env.NODE_ENV == "test";
        
        if (isTest) {
            // sqlite database
            this._connection = new Sequelize("database", null, null, Config);
        } else {
            // postgres database
            this._connection = new Sequelize(Config.url, Config);
        }
    }

    /**
     * models initiations
     */
    private defineModels() {
        User.define(this._connection);
    }

    /**
     * make all the associations shine
     */
    private associateModels() {}
}

export default new DataBase();
