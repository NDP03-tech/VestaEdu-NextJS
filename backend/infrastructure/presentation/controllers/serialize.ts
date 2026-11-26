/**
 * Chuyển entity/value object sang JSON thuần để trả cho client.
 *
 * Nhiều domain entity (Instructor, Blog, Course, Event, User...) lưu dữ liệu
 * ở thuộc tính private `_name`, `_role`... và KHÔNG có `toJSON()`, nên nếu
 * `res.json(entity)` thì client nhận `{ _name, _role, _passwordHash }` thay vì
 * `{ name, role }` mà frontend đọc.
 *
 * - Có `toJSON()` -> dùng nó (hành vi cũ, không đổi).
 * - Không có      -> bỏ tiền tố "_" khỏi tên thuộc tính.
 * - Luôn loại bỏ các trường nhạy cảm (passwordHash, ...), kể cả ở /api/me.
 */
const SENSITIVE_KEYS = new Set(["passwordHash", "password", "tokenHash"]);

export function serialize(
  value: unknown,
  seen: WeakSet<object> = new WeakSet(),
): unknown {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map((item) => serialize(item, seen));
  if (typeof value !== "object") return value;
  if (value instanceof Date || Buffer.isBuffer(value)) return value;

  const candidate = value as { toJSON?: () => unknown };
  if (typeof candidate.toJSON === "function") return candidate.toJSON();

  if (seen.has(value)) return undefined; // chặn tham chiếu vòng
  seen.add(value);
  const output: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    const name = key.startsWith("_") ? key.slice(1) : key;
    if (SENSITIVE_KEYS.has(name)) continue;
    output[name] = serialize(child, seen);
  }
  seen.delete(value);
  return output;
}
