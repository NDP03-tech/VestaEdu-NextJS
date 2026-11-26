"use strict";

// Idempotent: DB nào đã có sẵn cột passingScore thì bỏ qua, không báo lỗi.
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(
      `ALTER TABLE quizzes
         ADD COLUMN IF NOT EXISTS "passingScore" INTEGER NOT NULL DEFAULT 90`,
    );
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(
      `ALTER TABLE quizzes DROP COLUMN IF EXISTS "passingScore"`,
    );
  },
};
