/**
 * Smoke test: chứng minh UserEntity thực sự hash password.
 * Chạy: npm run build && node scripts/test-user-hashing.js
 *
 * Test import từ dist/ (đã compile bằng tsc).
 */
const { BcryptPasswordHasher } = require("../dist/infrastructure/security");
const { UserEntity } = require("../dist/domain/entities/user.entity");

(async () => {
  const hasher = new BcryptPasswordHasher();

  // ---- Test 1: create() phải hash password ----
  console.log("Test 1: create() hash password");
  const user = await UserEntity.create(
    {
      email: "test@example.com",
      password: "MyPlainPassword123",
      role: "student",
    },
    hasher
  );

  const hash = user.passwordHash;
  console.log("  plain input:    MyPlainPassword123");
  console.log("  stored hash:   ", hash);
  console.log(
    "  hash format:   ",
    hash.startsWith("$2") ? "✓ bcrypt" : "✗ NOT BCRYPT"
  );
  console.log(
    "  hash !== plain:",
    hash !== "MyPlainPassword123" ? "✓" : "✗ STILL PLAIN!"
  );

  // ---- Test 2: verifyPassword đúng ----
  console.log("\nTest 2: verifyPassword khớp");
  const ok = await user.verifyPassword("MyPlainPassword123", hasher);
  console.log("  verify đúng password:", ok ? "✓" : "✗");

  // ---- Test 3: verifyPassword sai ----
  console.log("\nTest 3: verifyPassword sai");
  const wrong = await user.verifyPassword("WrongPassword", hasher);
  console.log("  verify sai password:", wrong ? "✗ false positive" : "✓");

  // ---- Test 4: changePassword tự hash lại ----
  console.log("\nTest 4: changePassword hash lại");
  const oldHash = user.passwordHash;
  await user.changePassword("NewPassword456", hasher);
  const newHash = user.passwordHash;
  console.log("  hash changed:    ", oldHash !== newHash ? "✓" : "✗");
  console.log(
    "  verify mới ok:   ",
    (await user.verifyPassword("NewPassword456", hasher)) ? "✓" : "✗"
  );
  console.log(
    "  verify cũ fail:  ",
    !(await user.verifyPassword("MyPlainPassword123", hasher)) ? "✓" : "✗"
  );

  // ---- Test 5: reconstitute giữ nguyên hash (không hash lại) ----
  console.log("\nTest 5: reconstitute giữ hash từ DB");
  const sameHash = "$2a$10$abcdefghijklmnopqrstuv1234567890abcdefghijklmnopqrstuv";
  const user2 = UserEntity.reconstitute({
    id: "fixed-id",
    email: "x@y.com",
    passwordHash: sameHash,
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log(
    "  hash nguyên vẹn:",
    user2.passwordHash === sameHash ? "✓" : "✗"
  );

  // ---- Test 6: setHashedPassword bắt format sai ----
  console.log("\nTest 6: setHashedPassword chặn non-bcrypt");
  try {
    user2.setHashedPassword("not-a-bcrypt-hash");
    console.log("  ✗ KHÔNG throw - lỗ hổng!");
  } catch (e) {
    console.log("  ✓ throw:", e.message);
  }

  // ---- Test 7: validate email ----
  console.log("\nTest 7: validate email lỗi");
  try {
    await UserEntity.create(
      { email: "not-an-email", password: "abc12345" },
      hasher
    );
    console.log("  ✗ KHÔNG throw");
  } catch (e) {
    console.log("  ✓ throw:", e.message);
  }

  // ---- Test 8: validate password quá ngắn ----
  console.log("\nTest 8: validate password quá ngắn");
  try {
    await UserEntity.create(
      { email: "a@b.com", password: "123" },
      hasher
    );
    console.log("  ✗ KHÔNG throw");
  } catch (e) {
    console.log("  ✓ throw:", e.message);
  }

  console.log("\nAll tests done.");
})().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
