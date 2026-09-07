/**
 * Script trả về bản sao trong các getter để tránh mutate trực tiếp state nội bộ.
 * Cú pháp cũ: return this._xxx
 * Cú pháp mới: return [...this._xxx]  (cho array) hoặc return { ...this._xxx } (cho object)
 */
const fs = require("fs");
const path = require("path");

const ENT_DIR = path.join(__dirname, "..", "domain", "entities");
const files = fs.readdirSync(ENT_DIR).filter((f) => f.endsWith(".entity.ts"));

const ARRAY_GETTERS = [
  "answers",
  "options",
  "gaps",
  "dropdowns",
  "highlights",
  "hintWords",
  "studentIds",
  "schedule",
];
const OBJECT_GETTERS = ["metadata"];

for (const file of files) {
  const filePath = path.join(ENT_DIR, file);
  let content = fs.readFileSync(filePath, "utf8");
  const orig = content;

  for (const getter of ARRAY_GETTERS) {
    // Pattern 1: get xxx(): SomeType { return this._xxx; }
    // Pattern 2: get xxx() { return this._xxx; }  (no type annotation)
    // Pattern 3: get xxx() { return this.props.xxx; }
    const patterns = [
      new RegExp(
        `(\\bget\\s+${getter}\\s*\\(\\s*\\)\\s*:[^{]*\\{\\s*)return\\s+this\\._${getter}\\s*;`,
        "g"
      ),
      new RegExp(
        `(\\bget\\s+${getter}\\s*\\(\\s*\\)\\s*:[^{]*\\{\\s*)return\\s+this\\.props\\.${getter}\\s*;`,
        "g"
      ),
      new RegExp(
        `(\\bget\\s+${getter}\\s*\\(\\s*\\)\\s*\\{\\s*)return\\s+this\\.props\\.${getter}\\s*;`,
        "g"
      ),
      new RegExp(
        `(\\bget\\s+${getter}\\s*\\(\\s*\\)\\s*\\{\\s*)return\\s+this\\._${getter}\\s*;`,
        "g"
      ),
    ];
    for (const re of patterns) {
      content = content.replace(re, "$1return [...this.props." + getter + "];");
      content = content.replace(re, "$1return [...this._" + getter + "];");
    }
  }

  for (const getter of OBJECT_GETTERS) {
    const patterns = [
      new RegExp(
        `(\\bget\\s+${getter}\\s*\\(\\s*\\)\\s*:[^{]*\\{\\s*)return\\s+this\\._${getter}\\s*;`,
        "g"
      ),
      new RegExp(
        `(\\bget\\s+${getter}\\s*\\(\\s*\\)\\s*:[^{]*\\{\\s*)return\\s+this\\.props\\.${getter}\\s*;`,
        "g"
      ),
      new RegExp(
        `(\\bget\\s+${getter}\\s*\\(\\s*\\)\\s*\\{\\s*)return\\s+this\\.props\\.${getter}\\s*;`,
        "g"
      ),
      new RegExp(
        `(\\bget\\s+${getter}\\s*\\(\\s*\\)\\s*\\{\\s*)return\\s+this\\._${getter}\\s*;`,
        "g"
      ),
    ];
    for (const re of patterns) {
      content = content.replace(re, "$1return { ...this.props." + getter + " };");
      content = content.replace(re, "$1return { ...this._" + getter + " };");
    }
  }

  if (content !== orig) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✓ ${file}`);
  }
}

console.log("\nXong.");
