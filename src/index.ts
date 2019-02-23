import * as dotenv from "dotenv";
dotenv.config();

import firebase from "./config/firebase";
import server from "./config/server";
import { db as postgres } from "./storage/postgres";

(async () => {
    firebase.initializeApp();
    await postgres.isReady();
    await server.start();
})().catch(error => console.log(error));
