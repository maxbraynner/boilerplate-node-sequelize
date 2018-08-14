'use strict';

import * as Sequelize from 'sequelize'

/**
 * fields of a single database row
 */
export interface UserAttribute {
    id: string
    nome: string
    scope: {
        admin: boolean,
        user: boolean
    }
}

/**
 * a single database row
 */
export interface UserInstance extends Sequelize.Instance<UserAttribute>, UserAttribute {
}

/**
 * a table in the database
 */
export interface UserModel extends Sequelize.Model<UserInstance, UserAttribute> { }

class User {
    private model: Sequelize.Model<UserInstance, UserAttribute>;

    public register(con: Sequelize.Sequelize) {
        this.model = con.define<UserInstance, UserAttribute>('user', {
            id: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false,
                autoIncrement: false,
            },
            scope: {
                type: Sequelize.JSONB,
                allowNull: false,
            },
            nome: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
        }
        );
        return this.model;
    }

    public associate(models) {
        
    }
}

export default new User();