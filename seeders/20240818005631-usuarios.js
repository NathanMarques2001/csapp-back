module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usuarios = [];

    for (let i = 1; i <= 10; i++) {
      const nome = `Usuario ${i}`;
      const email = `usuario${i}@example.com`;
      const tipo = i % 2 === 0 ? 'admin' : 'user';  // Alterna entre 'admin' e 'user'
      const senha = 'senhaSegura123';

      usuarios.push({
        nome,
        email,
        tipo,
        senha,
        logado: false,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('usuarios', usuarios, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('usuarios', null, {});
  }
};
