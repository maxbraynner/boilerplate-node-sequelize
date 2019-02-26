import * as cls from "cls-hooked";

/**
 * Create a namespace for sequelize transactions
 *
 * http://docs.sequelizejs.com/manual/tutorial/transactions.html#automatically-pass-transactions-to-all-queries
 */
const namespace = cls.createNamespace("database");

export { namespace };
