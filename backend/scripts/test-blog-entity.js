/**
 * Smoke test BlogEntity: chứng minh fix bug
 * Chạy: npm run build && node scripts/test-blog-entity.js
 */
const { BlogEntity } = require("../dist/domain/entities/blog.entity");

let pass = 0, fail = 0;

function expectThrows(label, fn, expectedMsg) {
  try {
    fn();
    console.log(`  ✗ ${label}: KHONG throw`);
    fail++;
  } catch (e) {
    if (expectedMsg && !e.message.includes(expectedMsg)) {
      console.log(`  ✗ ${label}: throw "${e.message}" != expected "${expectedMsg}"`);
      fail++;
    } else {
      console.log(`  ✓ ${label}: throw "${e.message}"`);
      pass++;
    }
  }
}

function expectEquals(label, actual, expected) {
  if (actual === expected) {
    console.log(`  ✓ ${label}: ${JSON.stringify(actual)}`);
    pass++;
  } else {
    console.log(`  ✗ ${label}: got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`);
    fail++;
  }
}

function expectTruthy(label, val) {
  if (val) { console.log(`  ✓ ${label}`); pass++; }
  else { console.log(`  ✗ ${label}: falsy`); fail++; }
}

const validProps = {
  title: "Hello",
  bannerImg: "banner.jpg",
  author: "Alice",
  authorImg: "alice.jpg",
  content: "Some content here",
  image: "cover.jpg",
};

(async () => {
  // ===== Group 1: getters (Bug #2) =====
  console.log("\n=== Bug #2: Getters ===");
  const blog = BlogEntity.create(validProps);
  expectEquals("get id (integer)", Number.isInteger(blog.id), true);
  expectEquals("get title", blog.title, "Hello");
  expectEquals("get image", blog.image, "cover.jpg");
  expectEquals("get bannerImg", blog.bannerImg, "banner.jpg");
  expectEquals("get author", blog.author, "Alice");
  expectEquals("get authorImg", blog.authorImg, "alice.jpg");
  expectEquals("get content", blog.content, "Some content here");
  expectTruthy("get createdAt is Date", blog.createdAt instanceof Date);
  expectTruthy("get updatedAt is Date", blog.updatedAt instanceof Date);

  // ===== Group 2: create() validation (Bug #1) =====
  console.log("\n=== Bug #1: create() validation ===");
  const mk = (overrides) => ({ ...validProps, ...overrides });
  expectThrows("title rong", () => BlogEntity.create(mk({ title: "" })));
  expectThrows("title chi whitespace", () => BlogEntity.create(mk({ title: "   " })));
  expectThrows("bannerImg rong", () => BlogEntity.create(mk({ bannerImg: "" })));
  expectThrows("author rong", () => BlogEntity.create(mk({ author: "" })));
  expectThrows("authorImg rong", () => BlogEntity.create(mk({ authorImg: "" })));
  expectThrows("content rong", () => BlogEntity.create(mk({ content: "" })));

  // ===== Group 3: image optional + normalize =====
  console.log("\n=== image: optional + normalize ===");
  const b1 = BlogEntity.create(mk({ image: undefined }));
  expectEquals("image undefined -> undefined", b1.image, undefined);
  const b2 = BlogEntity.create(mk({ image: "" }));
  expectEquals("image='' -> undefined", b2.image, undefined);
  const b3 = BlogEntity.create(mk({ image: "  cover.jpg  " }));
  expectEquals("image co whitespace -> trimmed", b3.image, "cover.jpg");

  // ===== Group 4: trim trong create =====
  console.log("\n=== Trim khi create ===");
  const b4 = BlogEntity.create(mk({
    title: "  Hello World  ",
    bannerImg: "  b.jpg  ",
    author: "  Alice  ",
    authorImg: "  ai.jpg  ",
    content: "  content  ",
  }));
  expectEquals("title trim", b4.title, "Hello World");
  expectEquals("bannerImg trim", b4.bannerImg, "b.jpg");
  expectEquals("author trim", b4.author, "Alice");
  expectEquals("authorImg trim", b4.authorImg, "ai.jpg");
  expectEquals("content trim", b4.content, "content");

  // ===== Group 5: updateContent (Bug #3) =====
  console.log("\n=== Bug #3: updateContent ===");
  const b5 = BlogEntity.create(mk({ content: "old" }));
  b5.updateContent("  new content with spaces  ");
  expectEquals("updateContent trim", b5.content, "new content with spaces");
  expectThrows("updateContent(null)", () => b5.updateContent(null));
  expectThrows("updateContent(undefined)", () => b5.updateContent(undefined));
  expectThrows("updateContent('')", () => b5.updateContent(""));
  expectThrows("updateContent('   ')", () => b5.updateContent("   "));

  // ===== Group 6: other updates =====
  console.log("\n=== Other update methods ===");
  const b6 = BlogEntity.create(mk({
    title: "  Hello  ",
    bannerImg: "  b.jpg  ",
    author: "  Alice  ",
    authorImg: "  ai.jpg  ",
    content: "  content  ",
    image: "  cover.jpg  ",
  }));
  b6.updateTitle("  New Title  ");
  expectEquals("updateTitle trim", b6.title, "New Title");
  b6.updateImage("  newimg.jpg  ");
  expectEquals("updateImage trim", b6.image, "newimg.jpg");
  b6.updateImage(undefined);
  expectEquals("updateImage(undefined)", b6.image, undefined);
  b6.updateImage("");
  expectEquals("updateImage('')->undefined", b6.image, undefined);
  b6.updateAuthor("  Bob  ");
  expectEquals("updateAuthor trim", b6.author, "Bob");
  b6.updateAuthorImg("  bob.jpg  ");
  expectEquals("updateAuthorImg trim", b6.authorImg, "bob.jpg");
  b6.updateBannerImg("  newbanner.jpg  ");
  expectEquals("updateBannerImg trim", b6.bannerImg, "newbanner.jpg");
  expectThrows("updateAuthor(rong)", () => b6.updateAuthor(""));
  expectThrows("updateAuthorImg(rong)", () => b6.updateAuthorImg(""));
  expectThrows("updateBannerImg(rong)", () => b6.updateBannerImg(""));

  // ===== Group 7: updatedAt =====
  console.log("\n=== updatedAt auto-update ===");
  const b7 = BlogEntity.create(mk({ content: "c" }));
  const oldUpdatedAt = b7.updatedAt.getTime();
  await new Promise((r) => setTimeout(r, 5));
  b7.updateTitle("new");
  expectTruthy("updatedAt > old sau update", b7.updatedAt.getTime() > oldUpdatedAt);

  // ===== Group 8: reconstitute =====
  console.log("\n=== reconstitute ===");
  const b8 = BlogEntity.reconstitute({
    id: 123,
    title: "t", bannerImg: "b", author: "a", authorImg: "ai", content: "c",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-02"),
  });
  expectEquals("reconstitute giu id", b8.id, 123);
  expectEquals("reconstitute giu createdAt", b8.createdAt.toISOString(), "2024-01-01T00:00:00.000Z");
  expectEquals("reconstitute giu updatedAt", b8.updatedAt.toISOString(), "2024-01-02T00:00:00.000Z");

  // ===== Tong ket =====
  console.log(`\n=== KET QUA: ${pass} passed, ${fail} failed ===`);
  process.exit(fail === 0 ? 0 : 1);
})();
