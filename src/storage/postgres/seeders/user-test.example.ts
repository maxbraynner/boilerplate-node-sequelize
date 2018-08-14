'use strict';

//exemplo de seeder para criação dos usuários de teste

import * as Sequelize from 'sequelize'

module.exports = {
  up: (queryInterface: Sequelize.QueryInterface) => {

    return queryInterface.bulkInsert('user', [
      {
        id: 'vss0FgCu3KaEa6RHwYq6zewocHC3',
        cpf: '82194101080',
        nome: 'test1',
        scope: JSON.stringify({
          admin: true,
          user: true
        })
      },
      {
        id: 'SIQUzrVQNDRxJGoYWw9YR5SpAJl2',
        cpf: '40341151068',
        nome: 'test2',
        scope: JSON.stringify({
          admin: true,
          user: true
        })
      },
    ]);

  },

  down: (queryInterface: Sequelize.QueryInterface) => {

    return queryInterface.bulkDelete('user', {
      id: {
        $in: ['vss0FgCu3KaEa6RHwYq6zewocHC3', 'SIQUzrVQNDRxJGoYWw9YR5SpAJl2']
      }
    });

  }
};
