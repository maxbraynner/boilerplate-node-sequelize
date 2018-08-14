'use strict';

import * as dotenv from 'dotenv';
dotenv.config();

import server from './config/server'
import firebase from './config/firebase'
import { db as postgres } from './storage/postgres'

(async () => {

    firebase.initializeApp();
    await postgres.isReady();
    await server.start();

})().catch(error => console.log(error));