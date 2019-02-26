"use strict";

import * as admin from "firebase-admin";
import { Request, Response } from "express";
import * as Boom from "boom";
import AuthRequest from "../../interfaces/AuthRequest";
import { db as postgres } from "../../storage/postgres";
import { UserModel } from "../../storage/postgres/models/user.model";
import { Scope } from "../../enums/Scope";
import UserFilter from "./users.filter";

class UserController {
    constructor(private userModel: UserModel) {}

    /**
     * Cria usuário no postgres e adiciona o scope no firebase auth
     * @param req
     * @param res
     */
    async create(req: AuthRequest, res: Response) {
        let user = req.body;
        try {
            const firebaseUser = await admin.auth().createUser({
                email: user.email,
                password: user["senha"],
                disabled: user["status"] === 0 ? true : false
            });

            user.id = firebaseUser.uid;
            user = await this.userModel.create(user);
            await admin
                .auth()
                .setCustomUserClaims(firebaseUser.uid, { scope: user.scope });

            res.json(user);
        } catch (error) {
            if (error.code === "auth/email-already-exists") {
                throw Boom.conflict("Usuário já existe");
            }

            if (error.code === "auth/invalid-password") {
                throw Boom.badRequest(error.message);
            }

            if (user && user.id) {
                await admin.auth().deleteUser(user.id);
            }
            throw error;
        }
    }

    async findById(req: AuthRequest, res: Response) {
        const uid = req.params.id;

        const user = await this.userModel.findById(uid, {
            rejectOnEmpty: true
        });

        res.json(user);
    }

    async profile(req: AuthRequest, res: Response) {
        const uid = req.credentials.uid;

        const user = await this.userModel.findById(uid, {
            rejectOnEmpty: true
        });

        res.json(user);
    }

    async find(req: AuthRequest, res: Response) {
        const filter: UserFilter = req.query;

        const where = {};

        if (filter.nome) {
            where["nome"] = {
                $like: filter.nome
            };
        }

        if (filter.email) {
            where["email"] = filter.email;
        }

        if (filter.scope) {
            where["scope"] = filter.scope;
        }

        const users = await this.userModel.findAndCount({
            where,
            order: [["updatedAt", "DESC"]]
        });

        res.json({ data: users });
    }

    async update(req: AuthRequest, res: Response) {
        const uid = req.params.id;
        const newUser = req.body;

        let user = await this.userModel.findById(uid, {
            rejectOnEmpty: true
        });

        const toUpdateFirebase = {
            disabled: newUser.status === 0 ? true : false
        };

        if (newUser.senha) {
            toUpdateFirebase["password"] = newUser.senha;
        }

        await admin.auth().updateUser(uid, toUpdateFirebase);
        await admin.auth().setCustomUserClaims(uid, { scope: newUser.scope });

        user = await user.update(newUser);

        res.json({ data: user });
    }

    async delete(req: AuthRequest, res: Response) {
        const userId = req.params.id;

        const user = await this.userModel.find({
            where: {
                id: userId
            },
            rejectOnEmpty: true
        });

        await user.destroy();

        await admin.auth().deleteUser(userId);

        res.json({ data: user });
    }

    async createAdmin(req: Request, res: Response) {
        const uid = req.params.uid;
        const auth = req.headers.authorization;

        if (auth !== process.env.ADMIN_TOKEN) {
            throw Boom.unauthorized();
        }

        await admin.auth().setCustomUserClaims(uid, { scope: Scope.ADMIN });

        res.json({
            uid,
            scope: Scope.ADMIN
        });
    }

    async isEmailAvailable(req: Request, res: Response) {
        const email = req.params.email;

        let isAvailable: boolean;
        try {
            await admin.auth().getUserByEmail(email);

            // encontrou um usuário com o email
            isAvailable = false;
        } catch (error) {
            switch (error.code) {
                case "auth/user-not-found":
                    isAvailable = true;
                    break;
                case "auth/invalid-email":
                    throw Boom.badRequest(error.message);
                    break;
                default:
                    throw error;
                    break;
            }
        }

        res.status(isAvailable ? 200 : 409).json({ email });
    }
}

function init(): UserController {
    return new UserController(postgres.models.user);
}

export default init;
