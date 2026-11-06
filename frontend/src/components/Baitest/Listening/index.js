import React, { useState } from "react";

import image from "./image.png";

/* ------------------------------------------------------------------ */
/* Dữ liệu chấm điểm                                                   */
/* ------------------------------------------------------------------ */

const TOTAL_QUESTIONS = 40;

// Đáp án một câu: chuỗi hoặc mảng các đáp án chấp nhận được (không phân biệt hoa/thường)
const CORRECT_ANSWERS = {
  1: "Carousel",
  2: ["clear tables", "clear the tables"],
  3: "Waiting staff",
  4: ["Millerby’s department", "Millerby", "Millerby's"],
  5: ["bake cakes", "bake the cakes"],
  6: "Food taster",
  7: "15.30",
  8: "label",
  9: ["extra pay", "1-week's wages", "one-week's wages"],
  10: "manage customer database",
  11: "H",
  12: "G",
  13: "C",
  14: "E",
  15: "D",
  16: "B",
  17: "C",
  18: "F",
  19: "B",
  20: "A",
  23: ["A good mood", "good mood"],
  24: ["shared hate", "hate"],
  25: "B",
  26: "D",
  27: "A",
  28: "B",
  29: "C",
  30: "D",
  33: "goals",
  34: "revised",
  35: "a planning team",
  36: [
    "key decision makers",
    "decision makers",
    "decision-makers",
    "key decision-makers",
  ],
  37: "individuals",
  38: "past",
  39: "predict",
  40: "exciting",
};

// Các cặp câu "chọn 2 đáp án", thứ tự không quan trọng
const PAIR_QUESTIONS = [
  { questions: [21, 22], correct: ["D", "E"] },
  { questions: [31, 32], correct: ["C", "E"] },
];

const BAND_TABLE = [
  [39, 9.0],
  [37, 8.5],
  [35, 8.0],
  [33, 7.5],
  [30, 7.0],
  [27, 6.5],
  [23, 6.0],
  [20, 5.5],
  [16, 5.0],
  [13, 4.5],
  [10, 4.0],
  [7, 3.5],
  [5, 3.0],
  [3, 2.5],
];

const calculateBandScore = (score) =>
  BAND_TABLE.find(([min]) => score >= min)?.[1] ?? 0;

// Số đáp án đúng (không trùng nhau) trong cặp câu
const scorePair = (first, second, correct) => {
  const picked = new Set([first, second].map((v) => v?.toUpperCase()));
  return correct.filter((letter) => picked.has(letter)).length;
};

const isSingleCorrect = (expected, given) => {
  if (!expected) return false;
  const answer = given?.toLowerCase();
  return [].concat(expected).some((ans) => ans.toLowerCase() === answer);
};

/* ------------------------------------------------------------------ */
/* Dữ liệu hiển thị                                                    */
/* ------------------------------------------------------------------ */

const MAP_OPTIONS = [
  "A gift shop",
  "B café",
  "C visitor centre",
  "D cave",
  "E decorated walls",
  "F information desk",
  "G cloakroom",
  "H volcanic rocks",
  "I temporary exhibition room",
];

const AREA_QUESTIONS = [
  { n: 17, label: "the north face" },
  { n: 18, label: "the south side" },
  { n: 19, label: "the central area" },
  { n: 20, label: "the top floor" },
];

const PURPOSE_OPTIONS = [
  "A to bring people together",
  "B to celebrate independence",
  "C to reflect nature",
  "D to represent the native culture",
  "E to provide views of the city",
  "F to symbolize what more recent arrivals offer",
];

const FRIENDSHIP_OPTIONS = [
  "A being a similar age",
  "B accessing means of communication",
  "C having common hobbies",
  "D sharing a physical environment",
  "E spending sufficient time together",
];

const MULTIPLE_CHOICE = [
  {
    n: 25,
    text: "There are three stages of making friends. These stages depend on",
    options: [
      "A doing things together",
      "B the age of the children",
      "C wanting someone to play with",
      "D getting to know each other",
    ],
  },
  {
    n: 26,
    text: "Around the age of eight to ten kids begin to",
    options: [
      "A hang out late in the evening",
      "B stay at their friend's house",
      "C have a best friend",
      "D trust each other",
    ],
  },
  {
    n: 27,
    text: "The most important factor at stage 3 is",
    options: [
      "A loyalty",
      "B getting into trouble at school.",
      "C testing out different people",
      "D jealousy",
    ],
  },
  {
    n: 28,
    text: "David thinks that both he and Maria are",
    options: [
      "A super trendy",
      "B a bit geeky",
      "C similar in age",
      "D awkward",
    ],
  },
  {
    n: 29,
    text: "What does David think people change when they are friends?",
    options: [
      "A the way they look",
      "B the things they do",
      "C the way they behave",
      "D talk about their behaviours",
    ],
  },
  {
    n: 30,
    text: "According to Maria, what do people look for in a friend?",
    options: [
      "A the friend’s social status",
      "B what they look like",
      "C someone with a sense of humour",
      "D possessing similar values",
    ],
  },
];

const PLANNER_OPTIONS = [
  "A available time",
  "B city residents",
  "C function",
  "D budget",
  "E appearance",
];

/* ------------------------------------------------------------------ */
/* Presentational helpers                                              */
/* ------------------------------------------------------------------ */

const TH = "border border-slate-300 bg-slate-50 p-3 text-left font-semibold";
const TD = "border border-slate-300 p-3 align-top";

const ExamTable = ({ children }) => (
  <div className="mb-6 overflow-x-auto">
    <table className="w-full border-collapse border border-slate-300 text-sm">
      {children}
    </table>
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 className="mb-2 mt-10 text-lg font-bold text-slate-900">{children}</h3>
);

const Instruction = ({ children }) => (
  <p className="mb-3 mt-6 text-sm font-medium italic text-slate-600">
    {children}
  </p>
);

const OptionList = ({ options }) => (
  <ul className="m-0 list-none space-y-1 p-0 text-sm text-slate-700">
    {options.map((option) => (
      <li key={option}>{option}</li>
    ))}
  </ul>
);

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const Listening = ({ setBandScore }) => {
  const [answers, setAnswers] = useState(() =>
    Object.fromEntries(
      Array.from({ length: TOTAL_QUESTIONS }, (_, i) => [i + 1, ""]),
    ),
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const setAnswer = (n, value) =>
    setAnswers((prev) => ({ ...prev, [n]: value }));

  const checkAnswers = () => {
    let newScore = 0;

    // Các cặp câu chọn 2 đáp án (21–22, 31–32)
    PAIR_QUESTIONS.forEach(({ questions: [a, b], correct }) => {
      newScore += scorePair(answers[a], answers[b], correct);
    });

    // Các câu còn lại
    const pairNumbers = new Set(PAIR_QUESTIONS.flatMap((p) => p.questions));
    for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
      if (pairNumbers.has(i)) continue;
      if (isSingleCorrect(CORRECT_ANSWERS[i], answers[i])) newScore++;
    }

    setBandScore(calculateBandScore(newScore)); // Lưu band điểm
    localStorage.setItem("listeningScore", newScore); // Lưu điểm vào localStorage
    setIsSubmitted(true);
  };

  // Ô nhập đáp án kèm số câu
  const blank = (n, width = "w-36") => (
    <span className="inline-flex items-center gap-1.5 align-middle">
      <span className="flex h-6 min-w-[24px] items-center justify-center rounded bg-slate-800 px-1.5 text-xs font-semibold text-white">
        {n}
      </span>
      <input
        type="text"
        aria-label={`Answer ${n}`}
        value={answers[n]}
        onChange={(e) => setAnswer(n, e.target.value)}
        className={`${width} rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
      />
    </span>
  );

  const flowSteps = [
    <>The vision is identified and {blank(33)} are selected.</>,
    <>
      Data is gathered and interpreted. The first draft of the plan is written
      and then {blank(34)}.
    </>,
    <>Draft 2 is presented to {blank(35)}.</>,
    <>Residents voice their opinions at a consultation meeting.</>,
    <>
      The final draft is written and presented to {blank(36)} at the city
      council.
    </>,
  ];

  return (
    <div className="mx-auto mt-8 max-w-5xl px-4 pb-12 text-slate-800">
      <h2 className="mb-6 rounded-lg bg-amber-100 px-4 py-4 text-center text-2xl font-bold text-amber-900 sm:text-3xl">
        A. LISTENING - 25-30 MINUTES
      </h2>

      <iframe
        src="https://drive.google.com/file/d/1aldhZwPVmcNq7a-uS5_FWYzOlmi_UWiS/preview"
        width="600"
        height="50"
        title="Listening Audio"
        className="mb-4 h-[50px] w-full"
      ></iframe>

      {/* ───────────── SECTION 1 ───────────── */}
      <SectionTitle>SECTION 1</SectionTitle>
      <Instruction>
        Questions 1-10: Complete the table below. Write NO MORE THAN TWO WORDS
        for each answer.
      </Instruction>

      <ExamTable>
        <thead>
          <tr>
            <th className={TH}>JOB</th>
            <th className={TH}>EMPLOYER</th>
            <th className={TH}>WORK DAYS</th>
            <th className={TH}>DUTIES</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={TD}>Kitchen assistant</td>
            <td className={TD}>The {blank(1)} Cafe</td>
            <td className={TD}>Weekends</td>
            <td className={TD}>{blank(2)}, Wash dishes</td>
          </tr>
          <tr>
            <td className={TD}>{blank(3)}</td>
            <td className={TD}>Bellamy’s Restaurant</td>
            <td className={TD}>Thursday and Friday evening</td>
            <td className={TD}>Serve customers, wipe tables</td>
          </tr>
          <tr>
            <td className={TD}>Barista</td>
            <td className={TD}>{blank(4)} store</td>
            <td className={TD}>Saturday</td>
            <td className={TD}>Prepare drinks, {blank(5)}</td>
          </tr>
        </tbody>
      </ExamTable>

      <Instruction>
        Questions 6–10: Answer the questions below. Write NO MORE THAN THREE
        WORDS AND/OR NUMBERS for each answer.
      </Instruction>

      <ExamTable>
        <thead>
          <tr>
            <th className={TH}>Position</th>
            <th className={TH}>Duties</th>
            <th className={TH}>Pay</th>
            <th className={TH}>Other benefits</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={TD}>{blank(6)}</td>
            <td className={TD}>Check food quality</td>
            <td className={TD}>£{blank(7, "w-24")} an hour</td>
            <td className={TD}>Recipe creation</td>
          </tr>
          <tr>
            <td className={TD}>Food packer</td>
            <td className={TD}>Pack and {blank(8)} label boxes</td>
            <td className={TD}>£8.45 an hour</td>
            <td className={TD}>{blank(9)} at the end of summer</td>
          </tr>
          <tr>
            <td className={TD}>Office assistant</td>
            <td className={TD}>Type reports, {blank(10, "w-56")}.</td>
            <td className={TD}>£12.50 an hour</td>
            <td className={TD}>receive health and safety training</td>
          </tr>
        </tbody>
      </ExamTable>

      {/* ───────────── SECTION 2 ───────────── */}
      <SectionTitle>SECTION 2</SectionTitle>
      <Instruction>
        Questions 11-16: Label the map below. Write the correct letter A–I, next
        to the questions.
      </Instruction>

      <div className="mb-6 grid gap-6 rounded-lg border border-slate-300 p-4 md:grid-cols-2">
        <div>
          <OptionList options={MAP_OPTIONS} />
          <div className="mt-4 space-y-2">
            {[11, 12, 13, 14, 15, 16].map((n) => (
              <div key={n}>{blank(n, "w-16")}</div>
            ))}
          </div>
        </div>
        <img src={image} alt="Map" className="h-auto max-w-full" />
      </div>

      <Instruction>
        Questions 17–20: How does the speaker describe the purpose of each of
        the following areas? Write the correct letter, A–F next to the
        questions.
      </Instruction>

      <div className="mb-6 grid gap-6 rounded-lg border border-slate-300 p-4 md:grid-cols-2">
        <div className="space-y-3">
          {AREA_QUESTIONS.map(({ n, label }) => (
            <div key={n} className="flex items-center gap-3 text-sm">
              {blank(n, "w-16")}
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div>
          <p className="m-0 mb-2 text-sm font-semibold">Purpose</p>
          <OptionList options={PURPOSE_OPTIONS} />
        </div>
      </div>

      <Instruction>
        Questions 21–22: What TWO things does David say are necessary for early
        friendships to form?
      </Instruction>
      <p className="mb-3 flex flex-wrap items-center gap-2 text-sm font-semibold">
        ANSWER: {blank(21, "w-16")} and {blank(22, "w-16")}
      </p>
      <OptionList options={FRIENDSHIP_OPTIONS} />

      <Instruction>
        Questions 23–30: Write NO MORE THAN THREE WORDS AND/OR NUMBERS for each
        answer.
      </Instruction>
      <div className="space-y-3 text-sm">
        <p className="m-0">
          What do people who easily become friends usually associate with their
          first meeting? {blank(23, "w-48")}
        </p>
        <p className="m-0">
          What negative emotion can bring people together? {blank(24, "w-48")}
        </p>
      </div>

      <Instruction>Questions 25–30: Choose the correct letter A–D.</Instruction>
      <div className="grid gap-4 md:grid-cols-2">
        {MULTIPLE_CHOICE.map(({ n, text, options }) => (
          <div
            key={n}
            className="rounded-lg border border-slate-200 bg-slate-50/60 p-4"
          >
            <p className="m-0 mb-2 text-sm">
              {text} {blank(n, "w-16")}
            </p>
            <OptionList options={options} />
          </div>
        ))}
      </div>

      <Instruction>
        Questions 31–32: What are the TWO main concerns of an urban planner?
      </Instruction>
      <p className="mb-3 flex flex-wrap items-center gap-2 text-sm font-semibold">
        ANSWER: {blank(31, "w-16")} and {blank(32, "w-16")}
      </p>
      <OptionList options={PLANNER_OPTIONS} />

      <Instruction>
        Questions 33–36: Complete the flow chart with NO MORE THAN THREE WORDS
        for each answer
      </Instruction>
      <div className="flex flex-col items-center gap-2">
        {flowSteps.map((step, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <span aria-hidden="true" className="text-xl text-slate-400">
                ↓
              </span>
            )}
            <div className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-loose shadow-sm">
              {step}
            </div>
          </React.Fragment>
        ))}
      </div>

      <Instruction>
        Questions 37–40: Complete the summary below. Write NO MORE THAN ONE WORD
        for each answer.
      </Instruction>
      <div className="space-y-3 text-sm leading-loose">
        <p className="m-0">
          Urban planning can be difficult for three key reasons.
        </p>
        <p className="m-0">
          The first is that much of a town or city belongs to {blank(37)} and
          not local government, taking control out of their hands.
        </p>
        <p className="m-0">
          The second issue is the impact of {blank(38)} planning decisions, such
          as roads which are too narrow for today's cars.
        </p>
        <p className="m-0">
          Finally, a planner has to {blank(39)} the needs of a future
          population.
        </p>
        <p className="m-0">
          So, although being a planner can be {blank(40)}, it is also very
          challenging.
        </p>
      </div>

      <button
        type="button"
        onClick={checkAnswers}
        disabled={isSubmitted}
        className="mt-8 cursor-pointer rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Submit
      </button>
    </div>
  );
};

export default Listening;
