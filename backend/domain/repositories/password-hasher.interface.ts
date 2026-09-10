/**
 * PasswordHasher - Port (interface) ở tầng domain
 *
 * Đây là một Domain Port theo phong cách Hexagonal/Clean Architecture.
 * Mục đích:
 *   - Domain layer (entity, use case) chỉ phụ thuộc vào interface này.
 *   - Infrastructure layer (bcrypt, argon2, scrypt...) cung cấp adapter.
 *
 * Lợi ích:
 *   - UserEntity KHÔNG bị "dính" vào bcrypt.
 *   - Dễ swap sang Argon2/Scrypt nếu sau này muốn.
 *   - Dễ unit test entity với một mock hasher.
 *
 * Adapter mặc định: xem infrastructure/security/bcrypt-password-hasher.ts
 */
export interface PasswordHasher {
  /**
   * Hash một plain-text password.
   * @throws nếu plain rỗng / quá ngắn (validator có thể xử lý ở entity trước)
   */
  hash(plain: string): Promise<string>;

  /**
   * So sánh plain-text password với hash đã lưu.
   * Trả về true nếu khớp, false nếu không.
   */
  verify(plain: string, hashed: string): Promise<boolean>;
}
