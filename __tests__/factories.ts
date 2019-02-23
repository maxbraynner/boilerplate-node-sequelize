import * as faker from "faker";
import { Static } from "factory-girl";
import { db } from "../src/storage/postgres";
const factory = require("factory-girl").factory as Static;

factory.define("User", db.models.user, {
    id: faker.random.uuid(),
    email: faker.internet.email(),
    nome: faker.name.findName(),
    status: "1",
    scope: {
        admin: true,
        user: true
    }
});

export { factory };
