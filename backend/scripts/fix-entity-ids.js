/**
 * Script chuyển đổi: tất cả _id: string (UUID) -> _id: number
 *
 * Lý do: Sequelize model thật dùng auto-increment integer PK.
 * Entity cũ dùng randomUUID() gây mismatch kiểu dữ liệu khi map sang DB.
 *
 * Chiến lược:
 *   1. Đổi `randomUUID()` thành `0` (giá trị tạm) - thực tế DB tự sinh
 *   2. Đổi `private readonly _id: string` thành `private readonly _id: number`
 *   3. Đổi `id: string` trong interface Props thành `id: number`
 *   4. Đổi `get id(): string` thành `get id(): number`
 */
const fs = require("fs");
const path = require("path");

const ENT_DIR = path.join(__dirname, "..", "domain", "entities");
const files = fs.readdirSync(ENT_DIR).filter((f) => f.endsWith(".entity.ts"));

let totalChanges = 0;
for (const file of files) {
  const filePath = path.join(ENT_DIR, file);
  let content = fs.readFileSync(filePath, "utf8");
  const orig = content;
  const fileName = file;

  // Skip question.entity (đã có position/length mới, không đụng)
  // Nhưng vẫn áp dụng các rule dưới - không conflict

  // 1. Đổi `id: string;` -> `id: number;` trong Props/interface
  content = content.replace(
    /(\b(?:readonly\s+)?id:\s*)string(\s*[;,])/g,
    "$1number$2"
  );

  // 2. Đổi `private readonly _id: string` -> `private readonly _id: number`
  content = content.replace(
    /private readonly _id:\s*string/g,
    "private readonly _id: number"
  );
  content = content.replace(
    /private\s+_id:\s*string/g,
    "private _id: number"
  );

  // 3. Đổi `get id() { return ...; }` không cần đổi return type vì type inference.
  //    Nhưng nếu có `get id(): string` thì đổi
  content = content.replace(/(\bget\s+id\(\)\s*:\s*)string/g, "$1number");

  // 4. randomUUID() -> 0 (DB sẽ tự sinh khi INSERT)
  // Chỉ thay thế trong các call site của create(), không phải import
  content = content.replace(
    /(\breturn new \w+Entity\()\s*randomUUID\(\s*\),/g,
    "$10," // tạm thời id=0, DB sẽ set
  );
  // Với trường hợp trên 1 dòng
  content = content.replace(
    /(\breturn new \w+Entity\()\s*randomUUID\(\s*\)\s*,/g,
    "$10,"
  );
  // Trường hợp id là tham số đầu tiên trong constructor gọi khác (không có "Entity" ngay trước)
  // Pattern: `new SomeClass(randomUUID(),` - đã cover bằng regex trên

  // 5. Xoá import randomUUID nếu không còn dùng
  const stillUsesRandomUUID = /randomUUID\s*\(/.test(
    content.replace(/import\s+\{[^}]*randomUUID[^}]*\}\s+from\s+["']crypto["'];?/g, "")
  );
  if (!stillUsesRandomUUID) {
    content = content.replace(
      /^import\s+\{\s*randomUUID\s*\}\s+from\s+["']crypto["'];?\s*$/m,
      "// (đã xoá import randomUUID - không còn dùng; DB tự sinh integer PK)"
    );
  }

  if (content !== orig) {
    fs.writeFileSync(filePath, content, "utf8");
    const changedLines = orig.split("\n").filter((l, i) => l !== content.split("\n")[i]).length;
    console.log(`✓ ${fileName} - đã sửa`);
    totalChanges++;
  } else {
    console.log(`  ${fileName} - không thay đổi`);
  }
}

console.log(`\nTổng: ${totalChanges} file đã được sửa.`);
