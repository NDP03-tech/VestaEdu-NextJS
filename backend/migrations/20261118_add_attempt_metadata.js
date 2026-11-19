"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        "user_quiz_results",
        "quiz_version",
        { type: Sequelize.INTEGER, allowNull: true },
        { transaction },
      );
      await queryInterface.addColumn(
        "user_quiz_results",
        "deadline",
        { type: Sequelize.DATE, allowNull: true },
        { transaction },
      );
      await queryInterface.addColumn(
        "user_quiz_results",
        "state",
        {
          type: Sequelize.JSONB,
          allowNull: false,
          defaultValue: Sequelize.literal("'{}'::jsonb"),
        },
        { transaction },
      );
    });
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn("user_quiz_results", "state", {
        transaction,
      });
      await queryInterface.removeColumn("user_quiz_results", "deadline", {
        transaction,
      });
      await queryInterface.removeColumn(
        "user_quiz_results",
        "quiz_version",
        { transaction },
      );
    });
  },
};
