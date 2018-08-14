'use strict';

import * as Sequelize from 'sequelize'

module.exports = {
  up: (queryInterface: Sequelize.QueryInterface, sequelize) => {
    return queryInterface.createTable('user', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        autoIncrement: false,
      },
      scope: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })

  },

  down: (queryInterface: Sequelize.QueryInterface, sequelize) => {
    return queryInterface.dropTable('user');
  }
};
