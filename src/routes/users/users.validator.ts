'use strict';

import * as Joi from 'joi';
import * as validate from "express-validation";
import { JoiState, JoiDocument } from '../../config/joiExtensions';

export const userSchemas = {
    create: {
        nome: Joi.string().required(),
        cpf: JoiDocument.document().cpf().required()
    },
    change: {
        nome: Joi.string().required(),
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

    cpf() {
        const model = {
            params: {
                cpf: JoiDocument.document().cpf().required()
            }
        }

        // retorna o middleware de validação
        return validate(model);
    }

}

function init() {
    return new UserValidator();
}

export default init;