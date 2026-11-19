"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        "quizzes",
        "status",
        {
          type: Sequelize.STRING(20),
          allowNull: false,
          defaultValue: "published",
        },
        { transaction },
      );
      await queryInterface.addColumn(
        "quizzes",
        "version",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        { transaction },
      );
    });
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn("quizzes", "version", { transaction });
      await queryInterface.removeColumn("quizzes", "status", { transaction });
    });
  },
};
