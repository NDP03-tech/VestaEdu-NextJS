"use strict";

/**
 * Đồng bộ schema DB với các TypeORM entity (synchronize = false nên phải
 * migrate tay). Migration này IDEMPOTENT: mỗi cột / ràng buộc chỉ được thêm
 * khi chưa tồn tại, nên chạy được trên DB đã có sẵn một phần cột.
 *
 * - questions:       "order", "highlights", "correctAnswer"
 * - class_students:  id (PK mới), "isActive", "joinedAt", UNIQUE(class_id, user_id)
 * - class_quizzes:   id (PK mới), "dueDate", "isActive", "assignedAt", UNIQUE(class_id, quiz_id)
 */
const SQL_UP = `
-- ---------- questions ----------
ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "highlights" JSONB,
  ADD COLUMN IF NOT EXISTS "correctAnswer" JSONB;

-- ---------- class_students ----------
DO $$
BEGIN
  -- Chỉ đổi khoá chính khi bảng chưa có cột id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'class_students' AND column_name = 'id'
  ) THEN
    ALTER TABLE class_students ADD COLUMN "id" SERIAL;
    ALTER TABLE class_students DROP CONSTRAINT IF EXISTS class_students_pkey;
    ALTER TABLE class_students ADD PRIMARY KEY ("id");
  END IF;

  ALTER TABLE class_students
    ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT TRUE;

  -- Chỉ backfill joinedAt khi cột vừa được tạo (không ghi đè dữ liệu có sẵn)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'class_students' AND column_name = 'joinedAt'
  ) THEN
    ALTER TABLE class_students
      ADD COLUMN "joinedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW();
    UPDATE class_students SET "joinedAt" = "createdAt" WHERE "createdAt" IS NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'class_students'::regclass AND contype = 'u'
  ) THEN
    ALTER TABLE class_students
      ADD CONSTRAINT class_students_class_id_user_id_key UNIQUE (class_id, user_id);
  END IF;
END $$;

-- ---------- class_quizzes ----------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'class_quizzes' AND column_name = 'id'
  ) THEN
    ALTER TABLE class_quizzes ADD COLUMN "id" SERIAL;
    ALTER TABLE class_quizzes DROP CONSTRAINT IF EXISTS class_quizzes_pkey;
    ALTER TABLE class_quizzes ADD PRIMARY KEY ("id");
  END IF;

  ALTER TABLE class_quizzes
    ADD COLUMN IF NOT EXISTS "dueDate" TIMESTAMP NULL,
    ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT TRUE;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'class_quizzes' AND column_name = 'assignedAt'
  ) THEN
    ALTER TABLE class_quizzes
      ADD COLUMN "assignedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW();
    UPDATE class_quizzes SET "assignedAt" = "createdAt" WHERE "createdAt" IS NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'class_quizzes'::regclass AND contype = 'u'
  ) THEN
    ALTER TABLE class_quizzes
      ADD CONSTRAINT class_quizzes_class_id_quiz_id_key UNIQUE (class_id, quiz_id);
  END IF;
END $$;
`;

const SQL_DOWN = `
ALTER TABLE class_quizzes
  DROP CONSTRAINT IF EXISTS class_quizzes_class_id_quiz_id_key,
  DROP CONSTRAINT IF EXISTS class_quizzes_pkey,
  DROP COLUMN IF EXISTS "assignedAt",
  DROP COLUMN IF EXISTS "isActive",
  DROP COLUMN IF EXISTS "dueDate",
  DROP COLUMN IF EXISTS "id";
ALTER TABLE class_quizzes ADD PRIMARY KEY (class_id, quiz_id);

ALTER TABLE class_students
  DROP CONSTRAINT IF EXISTS class_students_class_id_user_id_key,
  DROP CONSTRAINT IF EXISTS class_students_pkey,
  DROP COLUMN IF EXISTS "joinedAt",
  DROP COLUMN IF EXISTS "isActive",
  DROP COLUMN IF EXISTS "id";
ALTER TABLE class_students ADD PRIMARY KEY (class_id, user_id);

ALTER TABLE questions
  DROP COLUMN IF EXISTS "correctAnswer",
  DROP COLUMN IF EXISTS "highlights",
  DROP COLUMN IF EXISTS "order";
`;

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(SQL_UP, { transaction });
    });
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(SQL_DOWN, { transaction });
    });
  },
};
