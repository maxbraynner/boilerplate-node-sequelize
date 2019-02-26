'use strict';

import * as Joi from 'joi';
import * as validate from "express-validation";
import { Scope } from '../../enums/Scope';

export const userSchemas = {
    create: {
        email: Joi.string().required(),
        nome: Joi.string().required(),
        status: Joi.number().valid(0, 1).required(),
        scope: Joi.string().valid(Scope.USER, Scope.ADMIN).required(),
        senha: Joi.string().required(),
    },
    change: {
        email: Joi.string().forbidden(),
        nome: Joi.string().required(),
        status: Joi.number().valid(0, 1).required(),
        scope: Joi.string().valid(Scope.USER, Scope.ADMIN).required(),
        senha: Joi.string().optional(),
    }
}

class UserValidator {

    create() {
        const model = {
            body: userSchemas.create
        }

        // retorna o middleware de validação
        return validate(model);
    }

    change() {
        const model = {
            body: userSchemas.change
        }

        // retorna o middleware de validação
        return validate(model);
    }

}

function init() {
    return new UserValidator();
}

export default init;