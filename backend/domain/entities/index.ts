/**
 * Domain entities - export tất cả entities trong hệ thống
 *
 * Pattern: Mỗi entity là một pure domain object:
 *   - private constructor
 *   - static create(props)  : factory tạo entity mới (validate + auto generate id/timestamps)
 *   - static reconstitute(props) : tái tạo entity từ persistence layer
 *   - business methods có validation riêng
 *
 * Các Sequelize models trong /models là persistence layer.
 * Controllers có thể dùng entity để validate business rules
 * trước khi gọi model.
 *
 * HẦU HẾT validation/normalize helpers nằm trong ../../utils/validation
 * (re-export từ đó để tương thích ngược).
 */
export { BlogEntity } from "./blog.entity";
export { CategoryEntity } from "./category.entity";
export { ClassEntity } from "./class.entity";
export { UserEntity } from "./user.entity";
export type { UserRole } from "./user.entity";
export { CourseEntity } from "./course.entity";
export { EventEntity } from "./event.entity";
export {
  isQuizStatus,
  QuizEntity,
  type QuizStatus,
  type QuizVisibility,
  type QuizUiSettings,
} from "./quiz.entity";
export {
  QuestionEntity,
  type Gap,
  type Dropdown,
} from "./question.entity";
// Re-export QuestionType/QuestionOption/QUESTION_TYPES từ utils/validation
// để các consumer không phải thay đổi import path.
export {
  QUESTION_TYPES,
  type QuestionType,
  type QuestionOption,
} from "../../utils/validation";
export {
  InstructorEntity,
  type InstructorStatus,
} from "./instructor.entity";
export { CourseRegistrationEntity } from "./course-registration.entity";
export { EventRegistrationEntity } from "./event-registration.entity";
export {
  UserQuizResultEntity,
  type QuizAnswer,
} from "./user-quiz-result.entity";
export { AttemptCounterEntity } from "./attempt-counter.entity";
export { RefreshTokenEntity } from "./refresh-token.entity";
export { AuditLogEntity } from "./audit-log.entity";

