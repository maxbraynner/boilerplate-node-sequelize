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
    create = async (req: AuthRequest, res: Response) => {
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
    };

    findById = async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const { uid, scope } = req.credentials;

        if (id != uid && !scope.admin) {
            throw Boom.forbidden();
        }

        const user = await this.userModel.findById(id, {
            rejectOnEmpty: true
        });

        res.json(user);
    };

    find = async (req: AuthRequest, res: Response) => {
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
    };

    update = async (req: AuthRequest, res: Response) => {
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
    };

    delete = async (req: AuthRequest, res: Response) => {
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
    };

    createAdmin = async (req: Request, res: Response) => {
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
    };

    isEmailAvailable = async (req: Request, res: Response) => {
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
    };
}

export default new UserController(postgres.models.user);
