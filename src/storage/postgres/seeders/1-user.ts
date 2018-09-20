'use strict';

import * as Sequelize from 'sequelize'
import * as admin from 'firebase-admin';
import firebase from '../../../config/firebase';

firebase.initializeApp();
const users = [];

users.push({
  id: 'nxL6mrsisbh45Mnam8Qfy8zdrTp2',
  nome: 'Admin',
  email: 'admin@admin.com',
  password: 'admin123',
  scope: JSON.stringify({ admin: true, user: true }),
  status: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
});

module.exports = {
  up: async (queryInterface: Sequelize.QueryInterface) => {

    for (const user of users) {
      await admin.auth().createUser({
        displayName: user.nome,
        password: user.password,
        email: user.email,
        emailVerified: true,
        uid: user.id
      });

      await admin.auth().setCustomUserClaims(user.id, {
        scope: JSON.parse(user.scope)
      })

      delete user.password;
    }

    await queryInterface.bulkInsert('user', users);
  },

  down: async (queryInterface: Sequelize.QueryInterface) => {

    for (const user of users) {
      await admin.auth().deleteUser(user.id);
    }

    await queryInterface.bulkDelete('user', {
      id: {
        $in: users.map(u => u.id),
      }
    });

  }
};
