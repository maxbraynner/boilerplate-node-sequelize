import * as faker from "faker";
import { Static } from "factory-girl";
import { User } from "../src/storage/postgres/models";
const factory = require("factory-girl").factory as Static;

factory.define("User", User, {
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
