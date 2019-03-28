"use strict";

import { Model, DataTypes, Sequelize } from "sequelize";

export class User extends Model {
    id: string;
    nome: string;
    email: string;
    status: string;
    scope: {
        admin: boolean;
        user: boolean;
    };

    createdAt: Date;
    updatedAt: Date;

    public static define(sequelize: Sequelize) {
        this.init(
            {
                id: {
                    type: DataTypes.STRING,
                    primaryKey: true,
                    allowNull: false,
                    autoIncrement: false
                },
                scope: {
                    type: DataTypes.JSONB,
                    allowNull: false
                },
                nome: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true
                },
                status: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                createdAt: DataTypes.DATE,
                updatedAt: DataTypes.DATE
            },
            {
                sequelize,
                tableName: "user",
                timestamps: true
            }
        );
    }
}
