import { UserEntity } from "../../domain/entities";
import { User, UserRole as PersistenceUserRole } from "../persistence/User";

export class UserMapper {
  static toDomain(orm: User): UserEntity {
    return UserEntity.reconstitute({
      id: orm.id,
      email: orm.email,
      passwordHash: orm.password,
      role: orm.role,
      firstName: orm.firstName,
      lastName: orm.lastName,
      studentPhone: orm.studentPhone,
      guardianPhone: orm.guardianPhone,
      studentEmail: orm.studentEmail,
      guardianEmail: orm.guardianEmail,
      address: orm.address,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toPersistence(user: UserEntity): User {
    const orm = new User();
    orm.id = user.id;
    orm.email = user.email;
    orm.password = user.passwordHash;
    orm.role = user.role as PersistenceUserRole;
    orm.firstName = user.firstName;
    orm.lastName = user.lastName;
    orm.studentPhone = user.studentPhone;
    orm.guardianPhone = user.guardianPhone;
    orm.studentEmail = user.studentEmail;
    orm.guardianEmail = user.guardianEmail;
    orm.address = user.address;
    orm.createdAt = user.createdAt;
    orm.updatedAt = user.updatedAt;
    return orm;
  }
}
