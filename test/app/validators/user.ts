'use strict';

import * as chai from 'chai';
import 'mocha';
import * as Joi from 'joi';
import {userSchemas} from '../../../src/routes/users/users.validator';
import faker from 'faker';


const { expect } = chai;

describe('Validador de user', function () {

    describe('schema create', function(){

        it('should validate', function(){
            let data = { nome: faker.name.firstName(), cpf: 64122484553 }
            let { error } = Joi.validate(data, userSchemas.create);
            expect(error).to.be.null;
    
            let data2 = { nome: faker.name.firstName(), cpf: '641.224.845-53' }
            let {error : error2} = Joi.validate(data2, userSchemas.create);
            expect(error2).to.be.null;
        })
    
        it('should fail when length of cpf is lower than 11 ', function () {
            //fail regex [0-9]{11}
            let data = { nome: faker.name.firstName(), cpf: '12340' }
            let result: any = Joi.validate(data, userSchemas.create);
            expect(result.error).to.be.not.null;
        })//end it
    
        it('should fail when check digits of cpf are incorrect ', function () {
            let data = { nome: faker.name.firstName(), cpf: '12345678901' }
            let {error} = Joi.validate(data, userSchemas.create);
            expect(error).to.be.not.null;
        })//end it
        
        it('should fail when payload is incomplete', function(){
            let data:any = { cpf: '64122484553' }
            let result = Joi.validate(data, userSchemas.create);
            expect(result.error).to.be.not.null;

            data.nome = faker.name.firstName();
            delete data.cpf;
            result = Joi.validate(data, userSchemas.create);
            expect(result.error).to.be.not.null;
        })
    })//end describe create

    describe('schema change', function(){

        it('should validate', function(){
            let data = { nome: faker.name.firstName() }
            let { error } = Joi.validate(data, userSchemas.change);
            expect(error).to.be.null;
        })

        it('should fail when nome is invalid', function(){
            let data = { nome: null }
            let {error} = Joi.validate(data, userSchemas.change);
            expect(error).to.be.not.null;
        })
        
    })//end describe change
    
})


