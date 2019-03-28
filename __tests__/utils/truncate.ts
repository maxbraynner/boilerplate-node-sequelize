import { User } from "../../src/storage/postgres/models";

export const truncate = () => {
    User.destroy({ truncate: true, force: true });
};
