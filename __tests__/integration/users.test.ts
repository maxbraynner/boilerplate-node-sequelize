import * as request from "supertest";
import { truncate } from "../utils/truncate";
import { factory } from "../factories";
import app from "../../src/app";
import { UserInstance } from "../../src/storage/postgres/models/user.model";

describe("Users", () => {
    beforeAll(async () => {
        await truncate();
    });

    it("GET Users", async () => {
        const response = await request(app)
            .get("/users")
            .set("Authorization", `Bearer 123`);

        expect(response.status).toBe(200);
    });

    it("GET User by ID", async () => {
        const user = await factory.create("User") as UserInstance;

        const response = await request(app)
            .get("/users/" + user.id)
            .set("Authorization", `Bearer 123`);

        expect(response.status).toBe(200);
    });
});
