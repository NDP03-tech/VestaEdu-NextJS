/**
 * BcryptPasswordHasher - Adapter cho PasswordHasher port
 *
 * Adapter: chuyển lời gọi domain (port) sang thư viện cụ thể (bcrypt).
 * Đây là thành phần duy nhất trong codebase được phép import "bcryptjs"
 * cho mục đích hashing user.
 *
 * Lưu ý:
 *   - models/User.js vẫn có beforeCreate/beforeUpdate hook hash bằng bcrypt,
 *     nhưng nếu controller đã dùng UserEntity.create(hasher, ...) thì
 *     password đã được hash sẵn -> hook phát hiện "đã hash" sẽ bỏ qua
 *     (bcrypt hash luôn bắt đầu bằng "$2a$"/"$2b$" - chuỗi 60 ký tự).
 *     Để tránh double-hash, xem note trong models/User.js hoặc
 *     dùng instance method trên entity để setHashedPassword trước khi save.
 */
import bcrypt from "bcryptjs";
import type { PasswordHasher } from "../../domain/repositories/password-hasher.interface";

/** Cost factor mặc định - giữ nguyên với models/User.js */
const DEFAULT_SALT_ROUNDS = 10;

export class BcryptPasswordHasher implements PasswordHasher {
  constructor(private readonly saltRounds: number = DEFAULT_SALT_ROUNDS) {}

  async hash(plain: string): Promise<string> {
    if (!plain) {
      throw new Error("Plain password cannot be empty");
    }
    return await bcrypt.hash(plain, this.saltRounds);
  }

  async verify(plain: string, hashed: string): Promise<boolean> {
    if (!plain || !hashed) return false;
    return await bcrypt.compare(plain, hashed);
  }
}
