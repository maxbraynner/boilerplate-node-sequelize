'use strict';

import * as utils from '../../utils';
import * as HTTPStatus from 'http-status';
import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

const pgp = require('pg-promise')();
const db = pgp(process.env.POSTGRES_URL);
const PS = require('pg-promise').PreparedStatement;

const { expect } = chai;
chai.use(chaiHttp);

const base_url = '/users';

const testUser = {
  id: process.env.TEST_USER_UID,
  email: process.env.TEST_USER_EMAIL,
  cpf: process.env.TEST_USER_CPF,
  crm: process.env.TEST_USER_CRM,
  estado: process.env.TEST_USER_ESTADO,
  nome: process.env.TEST_USER_NOME,
  status: process.env.TEST_USER_STATUS
};

describe('Users', function () {

  describe('GET /users/cpf/:cpf', function () {

    it('expect CONFLIT(409) due to cpf found', function (done) {
      utils.makeGetCall(`${base_url}/cpf/${testUser.cpf}`, {}, {})
        .then(function (response: any) {
          expect(response).to.have.status(HTTPStatus.CONFLICT);
          done();
        })
        .catch(function (error) {
          done(error);
        })
    })

    it('expect return cpf', function (done) {
      let cpf = '85968473240';
      utils.makeGetCall(`${base_url}/cpf/${cpf}`, {}, {})
        .then(function (response: any) {
          expect(response).to.have.status(HTTPStatus.OK);
          expect(response.body.cpf).to.be.equal(cpf);
          done();
        })
        .catch(function (error) {
          done(error);
        })
    })

    it('expect failure due to invalid cpf', function (done) {
      let cpf = '1234';
      utils.makeGetCall(`${base_url}/cpf/${cpf}`, {}, {})
        .then(function (response: any) {
          expect(response).to.have.status(HTTPStatus.BAD_REQUEST);
          done();
        })
        .catch(function (error) {
          done(error);
        })
    })

  }) //describe GET /users/cpf/:cpf

  describe('GET /users/email/:email', function () {

    it('expect status CONFLIT(409) due to already existent email', function (done) {
      utils.makeGetCall(`${base_url}/email/${testUser.email}`, {}, {})
        .then(function (response: any) {
          expect(response).to.have.status(HTTPStatus.CONFLICT);
          done();
        })
        .catch(function (error) {
          done(error);
        })
    })

    it('expect return email', function (done) {
      let fakeEmail = 'fakeemail@info.net'
      utils.makeGetCall(`${base_url}/email/${fakeEmail}`, {}, {})
        .then(function (response: any) {
          expect(response).to.have.status(HTTPStatus.OK);
          expect(response.body.email).to.be.equal(fakeEmail);
          done();
        })
        .catch(function (error) {
          done(error);
        })
    })

  }) //describe GET /users/email/:email

  describe('GET /users', function () {

    it('expect return test user', async () => {
      const response: any = await utils.makeGetCall(base_url, {}, {});

      let user: any = response.body;
      expect(response).to.have.status(HTTPStatus.OK);
      expect(user.cpf).to.be.equal(testUser.cpf);
      expect(user.crm).to.be.equal(testUser.crm);
      expect(user.estado).to.be.equal(testUser.estado);
      expect(user.nome).to.be.equal(testUser.nome);
      expect(user.status).to.be.equal(testUser.status);
    })
  }) //end describe GET /users

  describe('POST /users', function () {

    it('expect create user', async () => {
      let response: any = await utils.makeGetCall(base_url);
      const id = response.body.id;
      if (id) {
        const deleteUser = new PS('delete-user', 'delete from public.user where id = $1', [id]);
        await db.none(deleteUser);
      }

      response = await utils.makePostCall(base_url, testUser, {});
      expect(response).to.have.status(HTTPStatus.OK);
    })

    it('expect BAD_REQUEST due to invalid payload', async function () {
      const wrongUser = { ...testUser };
      wrongUser.estado = 'SS';

      const response = await utils.makePostCall(base_url, wrongUser, {});
      expect(response).to.have.status(HTTPStatus.BAD_REQUEST);
    })

  })//end describe POST /users

  describe('PUT /users', function () {

    after('undo changes in test user', async function () {
      const { crm, nome, status, estado } = testUser;
      const payload = { crm, nome, estado, status };
      const response = await utils.makePutCall(base_url, payload, {});
      expect(response).to.have.status(HTTPStatus.OK);
    })

    it('expect change user', async () => {
      const { cpf, crm, nome, status } = testUser;
      const payload = { crm, nome, estado: 'BA', status };
      const response = await utils.makePutCall(base_url, payload, {});

      expect(response).to.have.status(HTTPStatus.OK);
    })

    it('expect OK(200) but ignore changes in cpf and new properties', async () => {
      const { crm, nome, status, estado } = testUser;
      const availableCpf = '8596847324';
      expect(availableCpf).to.be.not.equal(testUser.cpf);
      const payload = { crm, nome: 'testando', estado, cpf: availableCpf, newProp: 'nao_deve_salvar' };

      const response: any = await utils.makePutCall(base_url, payload, {});
      expect(response).to.have.status(HTTPStatus.OK);

      //verificando se o novo campo não foi adicioando
      expect(response.body.data.newProp).to.be.undefined;
    })

  })//end describe PUT /users


}); //describe users




