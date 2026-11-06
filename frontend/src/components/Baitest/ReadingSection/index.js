import React, { useState } from "react";

/* ------------------------------------------------------------------ */
/* Dữ liệu chấm điểm                                                   */
/* ------------------------------------------------------------------ */

const TOTAL_QUESTIONS = 40;

// Đáp án một câu: chuỗi hoặc mảng các đáp án chấp nhận được (không phân biệt hoa/thường)
const CORRECT_ANSWERS = {
  1: "B",
  2: "C",
  3: "A",
  4: "C",
  5: "D",
  10: ["Y", "YES"],
  11: ["NOT GIVEN", "NG"],
  12: ["NOT GIVEN", "NG"],
  13: ["NO", "N"],
  14: ["NO", "N"],
  15: ["NO", "N"],
  16: ["Y", "YES"],
  17: ["NOT GIVEN", "NG"],
  18: ["Y", "YES"],
  19: ["NO", "N"],
  20: ["NOT GIVEN", "NG"],
  21: "D",
  22: "D",
  23: "D",
  27: "A",
  28: "F",
  29: "C",
  30: "D",
  31: "B",
  32: "E",
  33: "H",
  34: "C",
  35: "functional",
  36: "mass monsters",
  37: "injuries",
  38: "weight training",
  39: "unstable",
  40: "recover",
};

// Nhóm câu "chọn nhiều đáp án": thứ tự không quan trọng, mỗi đáp án đúng
// (không trùng nhau) được 1 điểm
const MULTI_GROUPS = [
  { questions: [6, 7, 8, 9], correct: ["D", "F", "A", "G"] },
  { questions: [24, 25, 26], correct: ["B", "C", "D"] },
];

const BAND_TABLE = [
  [39, 8.5],
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

const normalize = (value) => (value ?? "").toString().trim().toLowerCase();

const isSingleCorrect = (expected, given) => {
  const answer = normalize(given);
  if (!expected || answer === "") return false;
  return [].concat(expected).some((ans) => ans.toLowerCase() === answer);
};

// Số đáp án đúng (không trùng nhau) trong một nhóm
const scoreGroup = (givenAnswers, correct) => {
  const picked = new Set(givenAnswers.map(normalize));
  return correct.filter((letter) => picked.has(letter.toLowerCase())).length;
};

/* ------------------------------------------------------------------ */
/* Nội dung bài đọc                                                    */
/* ------------------------------------------------------------------ */

const PASSAGE_1 = {
  title: "PASSAGE 1: THE ANTS",
  paragraphs: [
    [
      "A",
      `The ants are tiny and usually nest between rocks in the south coast of England. Transformed into research subjects at the University of Bristol, they raced along with a tabletop foraging for food - and then, remarkably, returned to guide others. Time and again, followers trailed behind leaders, darting this way and that along the route, presumably to memorise landmarks. Once a follower got its bearings, it tapped the leader with its antennae, prompting the lesson to literally proceed to the next step. The ants were only looking for food, but the researchers said the careful way the leaders led followers, thereby turning them into leaders in their own right, marked the Temnothorax albipennis ant as the very first example of a non-human animal exhibiting teaching behaviour.`,
    ],
    [
      "B",
      `"Tandem running is an example of teaching, to our knowledge the first in a non-human animal, that involves bidirectional feedback between teacher and pupil,” remarks Nigel Franks, professor of animal behaviour and ecology, whose paper on the ant educators was published last week in the journal Nature.`,
    ],
    [
      "C",
      `No sooner was the paper published, of course, than another educator questioned it. Marc Hauser, a psychologist and biologist and one of the scientists who came up with the definition of teaching, said it was unclear whether the ants had learned a new skill or merely acquired new information.`,
    ],
    [
      "D",
      `Later, Franks took a further study and found that there were even races between leaders. With the guidance of leaders, ants could find food faster. But the help comes at a cost for the leader, who normally would have reached the food about four times faster if not hampered by a follower. This means the hypothesis that the leaders deliberately slowed down in order to pass the skills on to the followers seems potentially valid. His ideas were advocated by the students who carried out the video project with him.`,
    ],
    [
      "E",
      `Opposing views still arose, however. Hauser noted that mere communication of information is commonplace in the animal world. Consider a species, for example, that uses alarm calls to warn fellow members about the presence. Sounding the alarm can be costly, because the animal may draw the attention of the predator to itself. But it allows others to flee to safety. “Would you call this teaching?” wrote Hauser. “The caller incurs a cost. The naive animals gain a benefit and new knowledge that better enables them to learn about the predator's location than if the caller had not called. This happens throughout the animal kingdom, but we don't call it teaching, even though it is clearly a transfer of information.`,
    ],
    [
      "F",
      `Tim Caro, a zoologist, presented two cases of animal communication. He found that cheetah mothers that take their cubs along on hunts gradually allow their cubs to do more of the hunting —going, for example, from killing a gazelle and allowing young cubs to eat merely tripping the gazelle and letting the cubs finish it off. At one level, such behaviour might be called teaching — except the mother was not really teaching the cubs to hunt but merely facilitating various stages of learning. In another instance, birds watching other birds using a stick to locate food such as insects and so on, are observed to do the same thing themselves while finding food later.`,
    ],
    [
      "G",
      `Psychologists study animal behaviour in part to understand the evolutionary roots of human behaviour, Hauser said. The challenge in understanding whether other animals truly teach one another, he added, is that human teaching involves a “theory of mind” teachers are aware that students don't know something. He questioned whether Franks' leader ants really knew that the follower ants were ignorant. Could they simply have been following an instinctive rule to proceed when the followers tapped them on the legs or abdomen? And did leaders that led the way to food - only to find that it had been removed by the experimenter - incur the wrath of followers? That, Hauser said, would suggest that the follower ant actually knew the leader was more knowledgeable and not merely following an instinctive routine itself.`,
    ],
    [
      "H",
      `The controversy went on and for a good reason. The occurrence of teaching in ants, if proven to be true, indicates that teaching can evolve in animals with tiny brains. It is probably the value of information in social animals that determines when teaching will evolve, rather than the constraints of brain size.`,
    ],
    [
      "I",
      `Bennett Galef Jr., a psychologist who studies animal behaviour and social learning at McMaster University in Canada, maintained that ants were unlikely to have a "theory of mind” - meaning that leaders and followers may well have been following instinctive routines that were not based on an understanding of what was happening in another ant's brain. He warned that scientists may be barking up the wrong tree when they look not only for examples of humanlike behaviour among other animals but humanlike thinking that underlies such behaviour. Animals may behave in ways similar to humans without a similar cognitive system, he said, so the behaviour is not necessarily a good guide into how humans came to think the way we do.`,
    ],
  ],
};

const PASSAGE_2 = {
  title: "Passage 2: Zoo conservation programmes",
  paragraphs: [
    [
      null,
      `One of London Zoo's recent advertisements caused me some irritation, so patently did it distort reality. Headlined "Without zoos, you might as well tell these animals to get stuffed", it was bordered with illustrations of several endangered species and went on to extol the myth that without zoos like London Zoo these animals "will almost certainly disappear forever". With the zoo world's rather mediocre record on conservation, one might be forgiven for being slightly sceptical about such an advertisement.`,
    ],
    [
      null,
      `Zoos were originally created as places of entertainment, and their suggested involvement with conservation didn't seriously arise until about 30 years ago when the Zoological Society of London held the first formal international meeting on the subject. Eight years later, a series of world conferences took place, entitled "The Breeding of Endangered Species", and from this point onwards conservation became the zoo community's buzzword. This commitment has now been clearly defined in The World Zoo Conservation Strategy (WZGS, September 1993), which although an important and welcome document does seem to be based on an unrealistic optimism about the nature of the zoo industry.`,
    ],
    [
      null,
      `The WZCS estimates that there are about 10,000 zoos in the world, of which around 1,000 represent a core of quality collections capable of participating in co-ordinated conservation programmes. This is probably the document's first failing, as I believe that 10,000 is a serious underestimate of the total number of places masquerading as zoological establishments. Of course, it is difficult to get accurate data but, to put the issue into perspective, I have found that, in a year of working in Eastern Europe, I discover fresh zoos on almost a weekly basis.`,
    ],
    [
      null,
      `The second flaw in the reasoning of the WZCS document is the naive faith it places in its 1,000 core zoos. One would assume that the calibre of these institutions would have been carefully examined, but it appears that the criterion for inclusion on this select list might merely be that the zoo is a member of a zoo federation or association. This might be a good starting point, working on the premise that members must meet certain standards, but again the facts don't support the theory.`,
    ],
    [
      null,
      `The greatly respected American Association of Zoological Parks and Aquariums (AAZPA) has had extremely dubious members, and in the UK the Federation of Zoological Gardens of Great Britain and Ireland has occasionally had members that have been roundly censured in the national press. These include Robin Hill Adventure Park on the Isle of Wight, which many considered the most notorious collection of animals in the country. This establishment, which for years was protected by the Isle's local council (which viewed it as a tourist amenity), was finally closed down following a damning report by a veterinary inspector appointed under the terms of the Zoo Licensing Act 1981.`,
    ],
    [
      null,
      `Even assuming that the WZCS's 1,000 core zoos are all of a high standard complete with scientific staff and research facilities, trained and dedicated keepers, accommodation that permits normal or natural behaviour, and a policy of co-operating fully with one another what might be the potential for conservation? Colin Tudge, author of Last Animals at the Zoo (Oxford University Press, 1992), argues that "if the world's zoos worked together in co-operative breeding programmes, then even without further expansion they could save around 2,000 species of endangered land vertebrates". This seems an extremely optimistic proposition from a man who must be aware of the failings and weaknesses of the zoo industry the man who, when a member of the council of London Zoo, had to persuade the zoo to devote more of its activities to conservation.`,
    ],
    [
      null,
      `Today approximately 16 species might be said to have been "saved" by captive breeding programmes, although a number of these can hardly be looked upon as resounding successes. Beyond that, about a further 20 species are being seriously considered for zoo conservation programmes. Given that the international conference at London Zoo was held 30 years ago, this is pretty slow progress and a long way off Tudge's target of 2,000.`,
    ],
  ],
};

const PASSAGE_3 = {
  title: "Passage 3: CALISTHENICS",
  paragraphs: [
    [
      "A",
      `From the very first caveman to scale a tree or hang from a cliff face, to the mighty armies of the Greco-Roman empires and the gymnasiums of modern American high schools, calisthenics has endured and thrived because of its simplicity and utility. Unlike strength training which involves weights, machines or resistance bands, calisthenics uses only the body's own weight for physical development.`,
    ],
    [
      "B",
      `Calisthenics enters the historical record at around 480 B.C., with Herodotus' account of the Battle of Thermopylae. Herodotus reported that, prior to the battle, the god-king Xerxes sent a scout party to spy on his Spartan enemies. The scouts informed Xerxes that the Spartans, under the leadership of King Leonidas, were practising some kind of bizarre, synchronised movements akin to a tribal dance. Xerxes was greatly amused. His own army was comprised of over 120,000 men, while the Spartans had just 300. Leonidas was informed that he must retreat or face annihilation. The Spartans did not retreat, however, and in the ensuing battle, they managed to hold Xerxes' enormous army at bay for some time until reinforcements arrived. It turns out their tribal dance was not a superstitious ritual but a form of calisthenics by which they were building awe-inspiring physical strength and endurance.`,
    ],
    [
      "C",
      `The Greeks took calisthenics seriously not only as a form of military discipline and strength but also as an artistic expression of movement and an aesthetically ideal physique. Indeed, the term calisthenics itself is derived from the Greek words for beauty and strength. We know from historical records and images from pottery, mosaics and sculptures of the period that the ancient Olympians took calisthenics training seriously. They were greatly admired – and still are, today – for their combination of athleticism and physical beauty.`,
    ],
    [
      "D",
      `Calisthenics experienced its second golden age in the 1800s. This century saw the birth of gymnastics, an organised sport that uses a range of bars, rings, vaulting horses and balancing beams to display physical prowess. This period is also when the phenomena of strongmen developed. These were people of astounding physical strength and development who forged nomadic careers by demonstrating outlandish feats of strength to stunned populations. Most of these men trained using hand balancing and horizontal bars, as modern weight machines had not yet been invented.`,
    ],
    [
      "E",
      `In the 1950s, calisthenics began to evolve again, influenced by the rise of fitness culture and the increasing popularity of bodyweight exercises. The introduction of calisthenics into schools and military training programs reinforced its importance. Today, calisthenics is not only a component of physical education but also a popular form of exercise for those seeking to develop strength and flexibility without the need for equipment.`,
    ],
    [
      "F",
      `In the 1960s and 1970s calisthenics and the goal of functional strength combined with physical beauty was replaced by an emphasis on huge muscles at any cost. This became the sport of bodybuilding. Although bodybuilding's pioneers were drawn from the calisthenics tradition, the sole goal soon became an increase in muscle size. Bodybuilding icons, people such as Arnold Schwarzenegger and Sergio Oliva, were called mass monsters because of their imposing physiques. Physical development of this nature was only attainable through the use of anabolic steroids, synthetic hormones which boosted muscle development while harming overall health. These bodybuilders also relied on free weights and machines, which allowed them to target and bloat the size of individual muscles rather than develop a naturally proportioned body. Calisthenics, with its emphasis on physical beauty and a balance in proportions, had little to offer the mass monsters.`,
    ],
    [
      "G",
      `In this “bigger is better” climate, calisthenics was relegated to groups perceived to be vulnerable, such as women, people recuperating from injuries and school students. Although some of the strongest and most physically developed human beings ever to have lived acquired their abilities through the use of sophisticated calisthenics, a great deal of this knowledge was discarded and the method was reduced to nothing more than an easily accessible and readily available activity. Those who mastered the rudimentary skills of calisthenics could expect to graduate to weight training rather than advanced calisthenics.`,
    ],
    [
      "H",
      `In recent years, however, fitness trends have been shifting back toward the use of calisthenics. Bodybuilding approaches that promote excessive muscle development frequently lead to joint pain, injuries, unstable physiques and weak cardiovascular health. As a result, many of the newest and most popular gyms and programmes emphasise calisthenics-based methods instead. Modern practices often combine elements from a number of related traditions such as yoga, Pilates, kettle-ball training, gymnastics and traditional Greco-Roman calisthenics. Many people are keen to recover the original Greek vision of physical beauty and strength and harmony of the mind-body connection.`,
    ],
  ],
};

/* ------------------------------------------------------------------ */
/* Dữ liệu câu hỏi                                                     */
/* ------------------------------------------------------------------ */

const PERSON_OPTIONS = [
  "A. Bennett Galef Jr",
  "B. Tim Caro",
  "C. Nigel Franks",
  "D. Marc Hauser",
];

const PERSON_STATEMENTS = [
  { n: 1, text: "Animals could use objects to locate food." },
  { n: 2, text: "Ants show two-way, interactive teaching behaviours." },
  {
    n: 3,
    text: "It is risky to say ants can teach other ants like human beings do.",
  },
  { n: 4, text: "Ant leadership makes finding food faster." },
  { n: 5, text: "Communication between ants is not entirely teaching." },
];

const BEHAVIOUR_OPTIONS = [
  ["A", "Warn others in the presence of a threat"],
  ["B", "Evade potential predators"],
  ["C", "Safeguard their offspring"],
  ["D", "Establish contact using antennae"],
  ["E", "Interact among themselves"],
  ["F", "Engage in hunting to provide sustenance for their juveniles"],
  ["G", "Use tools like twigs"],
  ["H", "Consume a diverse range of nourishment"],
];

const YNNG_1 = [
  { n: 10, text: "Ants' tandem running involves two-way communication." },
  {
    n: 11,
    text: "Franks's theory got many supporters immediately after publicity.",
  },
  { n: 12, text: "Ants' teaching behaviour is the same as that of human." },
  { n: 13, text: "Cheetah hide hunting gains from younger one." },
];

const YNNG_2 = [
  { n: 14, text: "London Zoo's advertisements are honest." },
  { n: 15, text: "The Zoos record on conservation should not be doubted." },
  {
    n: 16,
    text: "Zoos made an insignificant contribution to conservation up until 30 years ago.",
  },
  { n: 17, text: "The WZCS document is not known in Eastern Europe." },
  { n: 18, text: "Zoos in the WZCS select list were carelessly inspected." },
  {
    n: 19,
    text: "No-one knew how the animals were being treated at Robin Hill Adventure Park.",
  },
  {
    n: 20,
    text: "Colin Tudge was dissatisfied with the treatment of animals at London Zoo.",
  },
];

const MULTIPLE_CHOICE = [
  {
    n: 21,
    text: "What were the objectives of the WZCS document?",
    options: [
      "A. to improve the calibre of zoos worldwide",
      "B. to list the endangered species of the world",
      "C. to provide funds for zoos in underdeveloped countries",
      "D. to identify zoos suitable for conservation practice",
    ],
  },
  {
    n: 22,
    text: "Why does the writer refer to Robin Hill Adventure Park?",
    options: [
      "A. to exemplify the standards in AAZPA zoos",
      "B. to illustrate a weakness in the WZCS document",
      "C. to support the Isle of Wight local council",
      "D. to criticise the 1981 Zoo Licensing Act",
    ],
  },
  {
    n: 23,
    text: "What word best describes the writer's response to Colin Tudge's prediction on captive breeding programmes?",
    options: [
      "A. impartial",
      "B. accepting",
      "C. prejudiced",
      "D. disbelieving",
    ],
  },
];

const FACTOR_OPTIONS = [
  "A. the lack of money in developing countries",
  "B. the number of unregistered zoos in the world",
  `C. the unrealistic aim of the WZCS in view of the number of species "saved" to date`,
  `D. the failure of the WZCS to examine the standards of the "core zoos"`,
  "E. the actions of the Isle of Wight local council",
  "F. the policies of WZCS zoo managers",
];

const PARAGRAPH_STATEMENTS = [
  {
    n: 27,
    text: "Factors influencing the survival of calisthenics throughout the ages",
  },
  {
    n: 28,
    text: "Harnessing a medical substance to increase muscle mass and strength",
  },
  { n: 29, text: "The origin of the word 'calisthenics'" },
  {
    n: 30,
    text: "A reference to travelling showmen who displayed their strength for audiences",
  },
  { n: 31, text: "The earliest use of calisthenics as a training method" },
  { n: 32, text: "The last popular supporter of calisthenics" },
  {
    n: 33,
    text: "A multidisciplinary approach to all-round health and strength",
  },
];

/* ------------------------------------------------------------------ */
/* Cấu trúc các Part                                                   */
/* ------------------------------------------------------------------ */

const range = (from, to) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

const PARTS = [
  { label: "Part 1", passage: PASSAGE_1, questions: range(1, 13) },
  { label: "Part 2", passage: PASSAGE_2, questions: range(14, 26) },
  {
    label: "Part 3",
    passage: PASSAGE_3,
    // Lưu ý: câu 34 hiện không có ô nhập trong đề nên không nằm trong danh sách
    questions: [...range(27, 33), ...range(35, 40)],
  },
];

const TOTAL_INPUTS = PARTS.reduce(
  (sum, part) => sum + part.questions.length,
  0,
);

/* ------------------------------------------------------------------ */
/* Presentational helpers                                              */
/* ------------------------------------------------------------------ */

const PassagePane = ({ title, paragraphs }) => (
  <div className="h-full overflow-y-auto bg-[#fffeec] p-5 sm:p-6">
    <h3 className="mb-4 mt-0 text-center text-xl font-bold text-slate-900">
      {title}
    </h3>
    <div className="space-y-4 text-justify text-base leading-relaxed text-slate-800 sm:text-[17px]">
      {paragraphs.map(([label, text], index) => (
        <p key={index} className="m-0">
          {label && <strong>{label} </strong>}
          {text}
        </p>
      ))}
    </div>
  </div>
);

const QuestionPane = ({ children }) => (
  <div className="h-full space-y-4 overflow-y-auto bg-white p-5 text-base sm:p-6">
    {children}
  </div>
);

const Heading = ({ children }) => (
  <p className="m-0 text-base font-bold text-slate-900">{children}</p>
);

const OptionList = ({ options }) => (
  <ul className="m-0 list-none space-y-1 p-0 text-[15px] text-slate-700">
    {options.map((option) => (
      <li key={option}>{option}</li>
    ))}
  </ul>
);

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const ReadingSection = ({ setBandScore }) => {
  const [answers, setAnswers] = useState(() =>
    Object.fromEntries(
      Array.from({ length: TOTAL_QUESTIONS }, (_, i) => [i + 1, ""]),
    ),
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activePart, setActivePart] = useState(0);
  const [mobilePane, setMobilePane] = useState("passage"); // chỉ dùng cho màn hình nhỏ

  const setAnswer = (n, value) =>
    setAnswers((prev) => ({ ...prev, [n]: value }));

  const isAnswered = (n) => (answers[n] ?? "").toString().trim() !== "";
  const countAnswered = (questions) => questions.filter(isAnswered).length;

  const checkAnswers = () => {
    let newScore = 0;

    // Nhóm chọn nhiều đáp án (6–9, 24–26)
    MULTI_GROUPS.forEach(({ questions, correct }) => {
      newScore += scoreGroup(
        questions.map((n) => answers[n]),
        correct,
      );
    });

    // Các câu còn lại
    const grouped = new Set(MULTI_GROUPS.flatMap((g) => g.questions));
    for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
      if (grouped.has(i)) continue;
      if (isSingleCorrect(CORRECT_ANSWERS[i], answers[i])) newScore++;
    }

    setBandScore(calculateBandScore(newScore)); // Lưu band điểm
    localStorage.setItem("readingScore", newScore);
    setIsSubmitted(true);
  };

  // Nhảy tới ô trả lời của một câu
  const goToQuestion = (n) => {
    setMobilePane("questions");
    setTimeout(() => {
      const el = document.getElementById(`q-${n}`);
      if (!el) return;
      el.scrollIntoView({ block: "center", behavior: "smooth" });
      el.focus({ preventScroll: true });
    }, 0);
  };

  // Ô nhập đáp án kèm số câu
  const blank = (n, width = "w-20") => (
    <span className="inline-flex items-center gap-1.5 align-middle">
      <span className="flex h-6 min-w-[24px] items-center justify-center rounded bg-slate-800 px-1.5 text-xs font-semibold text-white">
        {n}
      </span>
      <input
        id={`q-${n}`}
        type="text"
        aria-label={`Answer ${n}`}
        value={answers[n]}
        onChange={(e) => setAnswer(n, e.target.value)}
        className={`${width} rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
      />
    </span>
  );

  // Danh sách câu: ô nhập + nội dung
  const statements = (items, width) => (
    <ul className="m-0 list-none space-y-3 p-0 text-[15px]">
      {items.map(({ n, text }) => (
        <li key={n} className="flex flex-wrap items-center gap-2">
          {blank(n, width)}
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );

  // Nội dung câu hỏi của từng Part
  const questionPanels = [
    <>
      <Heading>
        Questions 1-5. Match the person A-D with the correct information
      </Heading>
      <OptionList options={PERSON_OPTIONS} />
      {statements(PERSON_STATEMENTS, "w-16")}

      <Heading>
        Questions 6-9: Which FOUR of the following behaviours of animals are
        mentioned in the passage?
      </Heading>
      <ul className="m-0 list-none space-y-1 p-0 text-[15px] text-slate-700">
        {BEHAVIOUR_OPTIONS.map(([letter, text]) => (
          <li key={letter}>
            <strong>{letter}</strong>: {text}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-2 text-[15px]">
        <strong>ANSWER:</strong>
        {[6, 7, 8, 9].map((n) => (
          <span key={n}>{blank(n, "w-16")}</span>
        ))}
      </div>

      <Heading>Questions 10-13 YES/NO/NOT GIVEN</Heading>
      {statements(YNNG_1, "w-28")}
    </>,

    <>
      <Heading>Questions 14-20 YES/NO/NOT GIVEN</Heading>
      {statements(YNNG_2, "w-28")}

      {MULTIPLE_CHOICE.map(({ n, text, options }) => (
        <div key={n} className="space-y-2 text-[15px]">
          <p className="m-0">
            <strong>{n}.</strong> {text}
          </p>
          <OptionList options={options} />
          <div className="flex items-center gap-2">
            <strong>ANSWER:</strong>
            {blank(n, "w-16")}
          </div>
        </div>
      ))}

      <Heading>Questions 24-26</Heading>
      <p className="m-0 text-[15px]">
        The writer mentions a number of factors which lead him to doubt the
        value of the WZCS document. Which THREE of the following factors are
        mentioned?
      </p>
      <OptionList options={FACTOR_OPTIONS} />
      <div className="flex flex-wrap items-center gap-2 text-[15px]">
        <strong>ANSWER:</strong>
        {[24, 25, 26].map((n) => (
          <span key={n}>{blank(n, "w-16")}</span>
        ))}
      </div>
    </>,

    <>
      <Heading>
        Questions 27–33 The text has eight paragraphs, A–H. Which paragraph
        contains:
      </Heading>
      {statements(PARAGRAPH_STATEMENTS, "w-16")}

      <Heading>
        Questions 34–40 Complete the summary below. Choose NO MORE THAN TWO
        WORDS from the text for each answer.
      </Heading>
      <div className="space-y-3 text-[15px] leading-loose">
        <p className="m-0">
          During the sixties and seventies, attaining huge muscles became more
          important than {blank(35, "w-32")} strength, or having an
          attractive-looking body. The first people to take up this new sport of
          bodybuilding had a background in calisthenics but the most famous
          practitioners became known as {blank(36, "w-32")} on account of the
          impressive size of their muscles. Drugs and mechanical devices were
          used to develop individual muscles to a monstrous size.
        </p>
        <p className="m-0">
          Calisthenics then became the domain of 'weaker' people: females,
          children and those recovering from {blank(37, "w-32")}. Much of the
          advanced knowledge about calisthenics was lost and the method was
          subsequently downgraded to the status of a simple, user-friendly
          activity. Once a person became skilled at this, he would progress to{" "}
          {blank(38, "w-32")}.
        </p>
        <p className="m-0">
          Currently, a revival of calisthenics is underway as extreme muscle
          building can harm the body leaving it sore, {blank(39, "w-32")}, and
          in poor cardiovascular health. Thus, the majority of residents want to{" "}
          {blank(40, "w-32")} the original Greek vision for recuperation.
        </p>
      </div>
    </>,
  ];

  const part = PARTS[activePart];
  const totalAnswered = PARTS.reduce(
    (sum, p) => sum + countAnswered(p.questions),
    0,
  );

  const paneButton = (id, label) => (
    <button
      type="button"
      onClick={() => setMobilePane(id)}
      className={`flex-1 cursor-pointer border-b-2 py-2 text-sm font-semibold transition-colors ${
        mobilePane === id
          ? "border-blue-600 text-blue-700"
          : "border-transparent text-slate-500 hover:text-slate-800"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex h-[100dvh] flex-col bg-slate-100 text-slate-800">
      {/* Thanh trên */}
      <header className="flex shrink-0 items-center justify-between gap-3 bg-slate-900 px-4 py-3 text-white">
        <h2 className="m-0 text-base font-bold sm:text-xl">
          B. READING - 60 MINUTES
        </h2>
        <span className="text-sm text-slate-300">
          {totalAnswered} / {TOTAL_INPUTS} answered
        </span>
      </header>

      {/* Chuyển Passage / Questions trên màn hình nhỏ */}
      <div className="flex shrink-0 border-b border-slate-200 bg-white lg:hidden">
        {paneButton("passage", "Passage")}
        {paneButton("questions", "Questions")}
      </div>

      {/* Bài đọc bên trái, câu hỏi bên phải */}
      <main className="grid min-h-0 flex-1 grid-cols-1 gap-px bg-slate-300 lg:grid-cols-2">
        <div
          key={`passage-${activePart}`}
          className={`min-h-0 ${
            mobilePane === "passage" ? "block" : "hidden"
          } lg:block`}
        >
          <PassagePane {...part.passage} />
        </div>
        <div
          key={`questions-${activePart}`}
          className={`min-h-0 ${
            mobilePane === "questions" ? "block" : "hidden"
          } lg:block`}
        >
          <QuestionPane>{questionPanels[activePart]}</QuestionPane>
        </div>
      </main>

      {/* Thanh dưới: chọn Part, số câu, nộp bài */}
      <footer className="flex shrink-0 flex-wrap items-center gap-2 border-t border-slate-300 bg-white px-3 py-2">
        {PARTS.map((p, index) => {
          const active = index === activePart;
          return (
            <div
              key={p.label}
              className={`flex flex-wrap items-center gap-1.5 rounded-md border px-2 py-1.5 ${
                active
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setActivePart(index);
                  setMobilePane("passage");
                }}
                aria-current={active ? "true" : undefined}
                className={`cursor-pointer border-0 bg-transparent px-1 text-sm font-semibold ${
                  active
                    ? "text-blue-700"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {p.label}
                {!active && (
                  <span className="ml-2 text-xs font-normal text-slate-500">
                    {countAnswered(p.questions)} of {p.questions.length}
                  </span>
                )}
              </button>

              {active &&
                p.questions.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => goToQuestion(n)}
                    aria-label={`Go to question ${n}`}
                    className={`h-7 w-7 cursor-pointer rounded border text-xs font-semibold transition-colors ${
                      isAnswered(n)
                        ? "border-slate-800 bg-slate-800 text-white"
                        : "border-slate-300 bg-white text-slate-700 hover:border-blue-500"
                    }`}
                  >
                    {n}
                  </button>
                ))}
            </div>
          );
        })}

        <button
          type="button"
          onClick={checkAnswers}
          disabled={isSubmitted}
          className="ml-auto cursor-pointer rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Submit
        </button>
      </footer>
    </div>
  );
};

export default ReadingSection;
