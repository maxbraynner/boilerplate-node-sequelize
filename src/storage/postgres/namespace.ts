import * as cls from "cls-hooked";
const Sequelize = require('sequelize');

/**
 * Create a namespace for sequelize transactions
 *
 * http://docs.sequelizejs.com/manual/tutorial/transactions.html#automatically-pass-transactions-to-all-queries
 */
const namespace = cls.createNamespace("database");
Sequelize.useCLS(namespace as any);

export { namespace, Sequelize };
