'use strict';

import * as admin from 'firebase-admin';

class ConfigFirebase {

    initializeApp(){        
        admin.initializeApp({
            credential: admin.credential.cert({
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: JSON.parse(`"${process.env.FIREBASE_PRIVATE_KEY}"`),
                projectId: process.env.FIREBASE_PROJECT_ID,
            }),
            // databaseURL: process.env.DATABASE_URL,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET
        });

        console.log("Firebase initialized");
    }

}

export default new ConfigFirebase();
