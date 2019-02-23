import { db } from "../../src/storage/postgres";

export const truncate = () => {
    Object.keys(db.models).map(key => {
        return db.models[key].destroy({ truncate: true, force: true });
    });
};
