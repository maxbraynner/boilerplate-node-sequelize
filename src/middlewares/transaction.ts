import * as onFinished from "on-finished";
import { Request, Response, NextFunction } from "express";
import { namespace } from "../storage/postgres/namespace";
import { db } from "../storage/postgres";

export const transaction = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    namespace.bindEmitter(req);
    namespace.bindEmitter(res);
    namespace.bind(next);
    namespace.run(async () => {
        const transaction = await db.con.transaction();
        namespace.set("transaction", transaction);
        onFinished(res, (err, res) => {
            if (!err && res.statusCode < 400) {
                transaction.commit();
            } else {
                transaction.rollback();
            }
        });
        next();
    });
};
