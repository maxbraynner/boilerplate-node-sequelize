'use strict';

import * as admin from "firebase-admin";
import { Request, Response } from "express";
import * as Boom from 'boom';
import { ForeignKeyConstraintError } from 'sequelize'
import { AuthRequest } from "../../interfaces";
import enums from "../../enums";
import { db as postgres } from "../../storage/postgres";
import { UserModel } from "../../storage/postgres/models/user.model";

class UsersController {

    private userModel: UserModel;

    constructor() {
        this.userModel = postgres.models.user;
    }

    /**
     * Cria usuário no postgres e adiciona o scope no firebase auth
     * @param req 
     * @param res 
     */
    async create(req: AuthRequest, res: Response) {
        const { body, credentials } = req;

        // remove mascara do cpf
        body.cpf = body.cpf.replace(/\D/g, '');

        body.id = credentials.uid;
        body.scope = {
            user: true,
            admin: false,
        }

        const user = await this.userModel.create(body);

        await admin.auth().setCustomUserClaims(credentials.uid, { scope: body.scope });

        res.json({ user });
    }

    async perfil(req: AuthRequest, res: Response) {
        const user = await this.userModel.findById(req.credentials.uid, {
            rejectOnEmpty: true
        });

        res.json(user);
    }

    async update(req: AuthRequest, res: Response) {
        const newUser = {
            nome: req.body.nome,
            crm: req.body.crm,
            estado: req.body.estado
        };

        const user = await this.userModel.update(newUser, {
            where: { id: req.credentials.uid },
            returning: true
        });

        res.json({ data: user[1] })
    }
    
    async isCpfAvailable(req: Request, res: Response) {
        let cpf = req.params.cpf;
        cpf = cpf.replace(/\D/g, "");

        const count = await this.userModel.count({ where: { cpf } });

        res.status(count === 0 ? 200 : 409).json({ cpf });
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
                case 'auth/user-not-found':
                    isAvailable = true;
                    break;
                case 'auth/invalid-email':
                    throw Boom.badRequest(error.message)
                    break;
                default:
                    throw error;
                    break;
            }
        }

        res.status(isAvailable ? 200 : 409).json({ email });
    }
}

function init(): UsersController {
    return new UsersController();
}

export default init;