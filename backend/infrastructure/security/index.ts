/**
 * Infrastructure - Security
 *
 * Cung cấp các adapter cho domain ports:
 *   - passwordHasher: instance mặc định của BcryptPasswordHasher
 *
 * Controllers / use cases nên import từ đây để dùng:
 *
 *   import { passwordHasher } from "../infrastructure/security";
 *   const user = await UserEntity.create({ ... }, passwordHasher);
 *   await user.verifyPassword("input", passwordHasher);
 */
import { BcryptPasswordHasher } from "./bcrypt-password-hasher";
import type { PasswordHasher } from "../../domain/ports/password-hasher.port";

export { BcryptPasswordHasher } from "./bcrypt-password-hasher";
export type { PasswordHasher } from "../../domain/ports/password-hasher.port";

/** Singleton instance - dùng mặc định trong toàn bộ app */
export const passwordHasher: PasswordHasher = new BcryptPasswordHasher();
