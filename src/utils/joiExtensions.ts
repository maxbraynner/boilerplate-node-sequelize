import * as Joi from 'joi';

export const JoiState = Joi.extend((joi) => ({
    base: joi.string(),
    name: 'estado',
    language: {
        sigla: 'Sigla inválida: {{v}}'
    },
    rules: [
        {
            name: 'uf',
            validate(params, value, state, options) {
                const siglas = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
                    'PA', 'PB', 'PR', 'PE', 'PI', 'RR', 'RO', 'RJ', 'RN', 'RS', 'SC', 'SP', 'SE', 'TO'];

                if (siglas.indexOf(value) < 0)
                    return joi.createError('estado.sigla', { v: value }, state, options);

                return value;
            } //end validate
        } //end rule
    ] //end rules
}));

export const JoiDocument = Joi.extend((joi) => ({
    base: joi.string(),
    name: 'document',
    coerce(value, state, options) {
        const strValue = String(value);
        return strValue;
    },
    language: {
        invalidCpfFormat: 'Formato inválido',
        invalidCheckDigits: 'Dígitos verificadores inválidos: {{dv1}}{{dv2}}'
    },
    rules: [
        {
            name: 'cpf',
            validate(params, value, state, options) {
                const newValue = value.replace(/\D/g, '');
                const regex = RegExp(/[0-9]{11}/);
                if (!regex.test(newValue)) {
                    // Generate an error, state and options need to be passed
                    return joi.createError('document.invalidCpfFormat', { v: newValue }, state, options);
                }

                const rcpf: string = newValue.split("").reverse().join(""); //inverte o cpf
                let digitoVerificador1 = 0, digitoVerificador2 = 0;

                for (let i = 2; i < 11; i++) {
                    digitoVerificador1 += parseInt(rcpf[i]) * (9 - ((i - 2) % 10));
                    digitoVerificador2 += parseInt(rcpf[i]) * (9 - ((i - 1) % 10));
                }

                digitoVerificador1 = (digitoVerificador1 % 11) % 10;
                digitoVerificador2 += digitoVerificador1 * 9;
                digitoVerificador2 = (digitoVerificador2 % 11) % 10;

                if (digitoVerificador1 === parseInt(rcpf[1]) &&
                    digitoVerificador2 === parseInt(rcpf[0])) {
                    return newValue;
                } else {
                    return joi.createError('document.invalidCheckDigits',
                        { v: newValue, dv1: digitoVerificador1, dv2: digitoVerificador2 }, state, options);
                }
            } //end validate
        } //end rule
    ] //end rules
}));