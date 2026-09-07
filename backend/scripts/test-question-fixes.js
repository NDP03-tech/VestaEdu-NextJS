/**
 * Test: cập nhật mới - HintWord.hint, Gap.position, Gap.length
 * Chạy: npm run build && node scripts/test-question-fixes.js
 */
const { QuestionEntity } = require("../dist/domain/entities/question.entity");

let pass = 0, fail = 0;
const ok = (label) => { console.log(`  ✓ ${label}`); pass++; };
const bad = (label) => { console.log(`  ✗ ${label}`); fail++; };
const eq = (label, actual, expected) => {
  const a = JSON.stringify(actual), b = JSON.stringify(expected);
  if (a === b) ok(label);
  else bad(`${label}: got ${a}, want ${b}`);
};

(async () => {
  // GROUP 1: HintWord có field hint
  console.log("\n=== HintWord.hint ===");
  {
    const q = QuestionEntity.create({
      quizId: "quiz-1",
      questionType: "blank-boxes",
      questionText: "Fill in",
      hintWords: [
        { index: 0, word: "  hello  ", hint: "  greeting  " },
        { index: 1, word: "world" },
        { index: 2, word: "  ", hint: "ignored" },
      ],
    });
    const hw = q.hintWords;
    eq("hintWords length sau normalize", hw.length, 2);
    eq("hint[0] word đã trim", hw[0].word, "hello");
    eq("hint[0] hint đã trim", hw[0].hint, "greeting");
    eq("hint[1] word không có hint", hw[1].word, "world");
    if (!("hint" in hw[1])) ok("hint[1] không có field hint");
    else bad("hint[1] không nên có field hint");
  }

  // GROUP 2: Gap có position và length
  console.log("\n=== Gap.position + Gap.length ===");
  {
    const q = QuestionEntity.create({
      quizId: "quiz-1",
      questionType: "blank-boxes",
      questionText: "Test gaps",
      gaps: [
        { index: 0, correctAnswers: ["a"], position: 10, length: 5 },
        { index: 1, correctAnswers: ["b"], position: -1, length: -5 },
        { index: 2, correctAnswers: ["c"], position: "20", length: "3" },
        { index: 3, correctAnswers: ["d"] },
      ],
    });
    const gaps = q.gaps;
    eq("gaps length (loại invalid)", gaps.length, 2);
    eq("gap[0] position", gaps[0].position, 10);
    eq("gap[0] length", gaps[0].length, 5);
    // gap[1], gap[2] đã bị loại vì position/length invalid
    // Nhưng gap[3] (không có position/length) được gán lại index=1
    eq("gap[1] tồn tại với index=1 (từ gap[3] cũ)", gaps[1]?.index, 1);
    eq("gap[1] không có position (backward compat)", gaps[1]?.position, undefined);
    if (!("position" in gaps[1])) ok("gap[1] không có field position");
  }

  // GROUP 3: HintWord backward-compatible
  console.log("\n=== Backward compat: HintWord không có hint ===");
  {
    const q = QuestionEntity.create({
      quizId: "quiz-1",
      questionType: "blank-boxes",
      questionText: "Test",
      hintWords: [
        { index: 0, word: "hello" },
        { index: 1, word: "world", hint: "earth" },
      ],
    });
    eq("hintWords count", q.hintWords.length, 2);
    eq("hint[0] word", q.hintWords[0].word, "hello");
    if (!("hint" in q.hintWords[0])) ok("hint[0] không có hint (backward compat OK)");
  }

  // GROUP 4: Gap backward-compat
  console.log("\n=== Backward compat: Gap không có position/length ===");
  {
    const q = QuestionEntity.create({
      quizId: "quiz-1",
      questionType: "blank-boxes",
      questionText: "Test",
      gaps: [{ index: 0, correctAnswers: ["x"] }],
    });
    eq("gap[0].correctAnswers", q.gaps[0].correctAnswers, ["x"]);
    if (!("position" in q.gaps[0])) ok("gap[0] không có position (backward compat OK)");
    if (!("length" in q.gaps[0])) ok("gap[0] không có length (backward compat OK)");
  }

  // GROUP 5: cấu trúc dữ liệu frontend gửi (sau convert snake_case -> camelCase)
  console.log("\n=== Khớp cấu trúc frontend QuestionFormTest.js ===");
  {
    const frontendPayload = {
      quizId: "quiz-frontend",
      questionType: "drag-drop-matching",
      questionText: "Match the words",
      readingContent: "",
      points: 1,
      gaps: [
        { index: 0, correct_answers: ["answer1", "answer2"], position: 5, length: 12 },
      ],
      dropdowns: [
        { index: 0, options: ["A", "B", "C"], correct_answer: "A" },
      ],
      hintWords: [
        { word: "clue", hint: "this is a clue" },
        { word: "hint2" },
      ],
      options: [],
    };
    // Bước convert snake_case -> camelCase thuộc controller/serializer.
    const converted = {
      ...frontendPayload,
      gaps: frontendPayload.gaps.map((g) => ({
        index: g.index,
        correctAnswers: g.correct_answers,
        position: g.position,
        length: g.length,
      })),
      dropdowns: frontendPayload.dropdowns.map((d) => ({
        index: d.index,
        options: d.options,
        correctAnswer: d.correct_answer,
      })),
    };
    const q = QuestionEntity.create(converted);
    eq("gaps sau convert", q.gaps, [
      { index: 0, correctAnswers: ["answer1", "answer2"], position: 5, length: 12 },
    ]);
    eq("dropdowns sau convert", q.dropdowns, [
      { index: 0, options: ["A", "B", "C"], correctAnswer: "A" },
    ]);
    eq("hintWords[0] với hint", q.hintWords[0], { index: 0, word: "clue", hint: "this is a clue" });
    eq("hintWords[1] không có hint", { ...q.hintWords[1] }, { index: 1, word: "hint2" });
  }

  // Tổng kết
  console.log(`\n=== KẾT QUẢ: ${pass} passed, ${fail} failed ===`);
  process.exit(fail === 0 ? 0 : 1);
})();
