"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const quizColumns = await queryInterface.describeTable("quizzes", {
        transaction,
      });
      if (!quizColumns.passingScore) {
        await queryInterface.addColumn(
          "quizzes",
          "passingScore",
          {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 90,
          },
          { transaction },
        );
      }

      const classStudentColumns = await queryInterface.describeTable(
        "class_students",
        { transaction },
      );
      if (!classStudentColumns.id) {
        await queryInterface.addColumn(
          "class_students",
          "id",
          {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          { transaction },
        );
        await queryInterface.sequelize.query(
          `CREATE SEQUENCE "class_students_id_seq"
             OWNED BY "class_students"."id"`,
          { transaction },
        );
        await queryInterface.sequelize.query(
          `ALTER TABLE "class_students"
             ALTER COLUMN "id" SET DEFAULT nextval('class_students_id_seq'::regclass)`,
          { transaction },
        );
        await queryInterface.sequelize.query(
          `UPDATE "class_students"
             SET "id" = nextval('class_students_id_seq'::regclass)
             WHERE "id" IS NULL`,
          { transaction },
        );
        await queryInterface.sequelize.query(
          `ALTER TABLE "class_students"
             ALTER COLUMN "id" SET NOT NULL`,
          { transaction },
        );
        await queryInterface.sequelize.query(
          `SELECT setval(
             'class_students_id_seq',
             GREATEST(COALESCE(MAX("id"), 0), 1),
             MAX("id") IS NOT NULL
           ) FROM "class_students"`,
          { transaction },
        );

        await queryInterface.removeConstraint(
          "class_students",
          "class_students_pkey",
          { transaction },
        );
        await queryInterface.addConstraint("class_students", {
          fields: ["id"],
          type: "primary key",
          name: "class_students_pkey",
          transaction,
        });
        await queryInterface.addConstraint("class_students", {
          fields: ["class_id", "user_id"],
          type: "unique",
          name: "class_students_class_id_user_id_key",
          transaction,
        });
      }

      if (!classStudentColumns.isActive) {
        await queryInterface.addColumn(
          "class_students",
          "isActive",
          {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
          },
          { transaction },
        );
      }
      if (!classStudentColumns.joinedAt) {
        await queryInterface.addColumn(
          "class_students",
          "joinedAt",
          {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          },
          { transaction },
        );
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeConstraint(
        "class_students",
        "class_students_pkey",
        { transaction },
      );
      await queryInterface.removeConstraint(
        "class_students",
        "class_students_class_id_user_id_key",
        { transaction },
      );
      await queryInterface.addConstraint("class_students", {
        fields: ["class_id", "user_id"],
        type: "primary key",
        name: "class_students_pkey",
        transaction,
      });
      await queryInterface.removeColumn("class_students", "joinedAt", {
        transaction,
      });
      await queryInterface.removeColumn("class_students", "isActive", {
        transaction,
      });
      await queryInterface.removeColumn("class_students", "id", {
        transaction,
      });
      await queryInterface.removeColumn("quizzes", "passingScore", {
        transaction,
      });
    });
  },
};
