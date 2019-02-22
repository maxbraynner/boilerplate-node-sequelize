'use strict';

import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as dotenv from 'dotenv';

dotenv.config();

const server = `http://localhost:${process.env.PORT || 3000}`;
chai.use(chaiHttp);

export const makePostCall = function (url, payload, header = {}) {
    return new Promise((resolve, reject) => {
        try {
            chai
                .request(server)
                .post(url)
                .set(header)
                .send(payload)
                .end(function (error, response) {
                    if (error) {
                        console.error(error);
                        reject(error);
                    } else {
                        resolve(response);
                    }
                });
        } catch (error) {
            console.error(`error: ${error} - ${header}`);
            reject(error);
        }
    });
};

export const makePutCall = function (url, payload, header = {}) {
    return new Promise((resolve, reject) => {
        try {
            chai
                .request(server)
                .put(url)
                .set(header)
                .send(payload)
                .end(function (error, response) {
                    if (error) {
                        console.error(error);
                        reject(error);
                    } else {
                        resolve(response);
                    }
                });
        } catch (error) {
            console.log(`error: ${error} - ${header}`);
            reject(error);
        }
    });
};

export const makeGetCall = function (url, query = {}, header = {}) {
    return new Promise((resolve, reject) => {
        try {
            chai
                .request(server)
                .get(url)
                .query(query)
                .set(header)
                .end(function (error, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(response);
                    }
                });
        } catch (error) {
            console.log(`error: ${error} - ${header}`);
            reject(error);
        }
    });
};

export const makeDelCall = function (url, payload = {}, header = {}) {
    return new Promise((resolve, reject) => {
        try {
            chai
                .request(server)
                .del(url)
                .set(header)
                .send(payload)
                .end(function (error, response) {
                    if (error) {
                        console.error(error);
                        reject(error);
                    } else {
                        resolve(response);
                    }
                });
        } catch (error) {
            console.log(`error: ${error} - ${header}`);
            reject(error);
        }
    });
};
