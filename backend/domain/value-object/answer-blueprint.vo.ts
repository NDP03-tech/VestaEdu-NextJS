// =====================================================
// AnswerBlueprint Value Object
// =====================================================
// Tổng hợp toàn bộ các phần tử câu trả lời của một Question:
// gaps, dropdowns, hintWords, highlights, options.
//
// Đóng gói logic:
//   1. Normalization & reindexing (tất cả phần tử được chuẩn hoá qua VO con)
//   2. Validation số lượng cloze marker với questionText (assertMatchesText)
//   3. Chấm điểm gộp thống nhất (grade) cho mọi dạng bài tập
// =====================================================
import {
  norm,
  notNull,
  reindex,
  type GradeBreakdownItem,
  type GradeResult,
} from "./shared";
import { Gap, type GapProps, type CreateGapInput } from "./gap.vo";
import {
  Dropdown,
  type DropdownProps,
  type CreateDropdownInput,
} from "./dropdown.vo";
import {
  HintWord,
  type HintWordProps,
  type CreateHintWordInput,
} from "./hint-word.vo";
import {
  Highlight,
  type HighlightProps,
  type CreateHighlightInput,
} from "./highlight.vo";
import {
  QuestionOption,
  type QuestionOptionProps,
  type CreateQuestionOptionInput,
} from "./question-option.vo";
import { countClozeMarkers } from "./count-cloze-markers";

export interface AnswerBlueprintProps {
  gaps?: GapProps[];
  dropdowns?: DropdownProps[];
  hintWords?: HintWordProps[];
  highlights?: HighlightProps[];
  options?: QuestionOptionProps[];
}

export interface CreateAnswerBlueprintInput {
  gaps?: CreateGapInput[];
  dropdowns?: CreateDropdownInput[];
  hintWords?: CreateHintWordInput[];
  highlights?: CreateHighlightInput[];
  options?: CreateQuestionOptionInput[];
}

export class AnswerBlueprint {
  private constructor(
    readonly gaps: readonly Gap[],
    readonly dropdowns: readonly Dropdown[],
    readonly hintWords: readonly HintWord[],
    readonly highlights: readonly Highlight[],
    readonly options: readonly QuestionOption[],
  ) {}

  static create(input: CreateAnswerBlueprintInput): AnswerBlueprint {
    const gaps = reindex(
      (input.gaps ?? []).map((g) => Gap.create(g)).filter(notNull),
    );
    const dropdowns = reindex(
      (input.dropdowns ?? []).map((d) => Dropdown.create(d)).filter(notNull),
    );
    const hintWords = reindex(
      (input.hintWords ?? []).map((h) => HintWord.create(h)).filter(notNull),
    );
    const highlights = reindex(
      (input.highlights ?? []).map((h) => Highlight.create(h)).filter(notNull),
    );
    const options = (input.options ?? [])
      .map((o) => QuestionOption.create(o))
      .filter(notNull);

    return new AnswerBlueprint(gaps, dropdowns, hintWords, highlights, options);
  }

  static reconstitute(props?: AnswerBlueprintProps): AnswerBlueprint {
    const gaps = (props?.gaps ?? []).map((g) => Gap.reconstitute(g));
    const dropdowns = (props?.dropdowns ?? []).map((d) =>
      Dropdown.reconstitute(d),
    );
    const hintWords = (props?.hintWords ?? []).map((h) =>
      HintWord.reconstitute(h),
    );
    const highlights = (props?.highlights ?? []).map((h) =>
      Highlight.reconstitute(h),
    );
    const options = (props?.options ?? []).map((o) =>
      QuestionOption.reconstitute(o),
    );

    return new AnswerBlueprint(gaps, dropdowns, hintWords, highlights, options);
  }

  isEmpty(): boolean {
    return (
      this.gaps.length === 0 &&
      this.dropdowns.length === 0 &&
      this.hintWords.length === 0 &&
      this.highlights.length === 0 &&
      this.options.length === 0
    );
  }

  /**
   * Đảm bảo số lượng gap/dropdown/hint khớp đúng số marker .cloze trong HTML.
   * Nếu questionText có marker cloze HTML, số lượng phải khớp chính xác.
   */
  assertMatchesText(questionText: string): void {
    const hasClozeMarkup = /<a\b[^>]*\bcloze\b/i.test(questionText);
    if (!hasClozeMarkup) {
      return;
    }

    const counts = countClozeMarkers(questionText);

    if (this.gaps.length !== counts.gaps) {
      throw new Error(
        `Số lượng gap (${this.gaps.length}) không khớp với số marker cloze gap (${counts.gaps}) trong questionText`,
      );
    }
    if (this.dropdowns.length !== counts.dropdowns) {
      throw new Error(
        `Số lượng dropdown (${this.dropdowns.length}) không khớp với số marker cloze dropdown (${counts.dropdowns}) trong questionText`,
      );
    }
    if (this.hintWords.length !== counts.hints) {
      throw new Error(
        `Số lượng hint (${this.hintWords.length}) không khớp với số marker cloze hint (${counts.hints}) trong questionText`,
      );
    }
  }

  grade(rawAnswer: unknown, pointsPerItem: number): GradeResult {
    let earned = 0;
    let max = 0;
    const breakdown: GradeBreakdownItem[] = [];

    const rawObj =
      rawAnswer && typeof rawAnswer === "object" && !Array.isArray(rawAnswer)
        ? (rawAnswer as Record<string, unknown>)
        : {};

    // 1. Gaps
    this.gaps.forEach((gap, idx) => {
      const userVal =
        rawObj[`gap_${idx}`] ??
        (Array.isArray(rawObj.gaps) ? rawObj.gaps[idx] : undefined) ??
        (Array.isArray(rawAnswer) &&
        this.dropdowns.length === 0 &&
        this.hintWords.length === 0
          ? rawAnswer[idx]
          : undefined) ??
        (this.gaps.length === 1 &&
        this.dropdowns.length === 0 &&
        this.hintWords.length === 0 &&
        this.options.length === 0 &&
        (typeof rawAnswer === "string" || typeof rawAnswer === "number")
          ? rawAnswer
          : undefined);

      const res = gap.grade(userVal, pointsPerItem);
      earned += res.earned;
      max += res.max;
      breakdown.push({
        label: `Gap ${idx + 1}`,
        userAnswer: userVal ?? "",
        correctAnswer: gap.correctAnswers[0] ?? "",
        correct: res.correct,
      });
    });

    // 2. Dropdowns
    this.dropdowns.forEach((dd, idx) => {
      const userVal =
        rawObj[`dropdown_${idx}`] ??
        (Array.isArray(rawObj.dropdowns) ? rawObj.dropdowns[idx] : undefined) ??
        (this.dropdowns.length === 1 &&
        this.gaps.length === 0 &&
        this.hintWords.length === 0 &&
        this.options.length === 0 &&
        (typeof rawAnswer === "string" || typeof rawAnswer === "number")
          ? rawAnswer
          : undefined);

      const res = dd.grade(userVal, pointsPerItem);
      earned += res.earned;
      max += res.max;
      breakdown.push({
        label: `Dropdown ${idx + 1}`,
        userAnswer: userVal ?? "",
        correctAnswer: dd.correctAnswer,
        correct: res.correct,
      });
    });

    // 3. HintWords
    this.hintWords.forEach((hw, idx) => {
      const userVal =
        rawObj[`hint_${idx}`] ??
        (Array.isArray(rawObj.hintWords) ? rawObj.hintWords[idx] : undefined) ??
        (this.hintWords.length === 1 &&
        this.gaps.length === 0 &&
        this.dropdowns.length === 0 &&
        this.options.length === 0 &&
        (typeof rawAnswer === "string" || typeof rawAnswer === "number")
          ? rawAnswer
          : undefined);

      const res = hw.grade(userVal, pointsPerItem);
      earned += res.earned;
      max += res.max;
      breakdown.push({
        label: `Hint ${idx + 1}`,
        userAnswer: userVal ?? "",
        correctAnswer: hw.word,
        correct: res.correct,
      });
    });

    // 4. Highlights
    if (this.highlights.length > 0) {
      const userHighlights = Array.isArray(rawAnswer)
        ? rawAnswer
        : Array.isArray(rawObj.highlights)
          ? rawObj.highlights
          : [];

      this.highlights.forEach((h, idx) => {
        const res = h.grade(userHighlights, pointsPerItem);
        earned += res.earned;
        max += res.max;
        breakdown.push({
          label: `Highlight ${idx + 1}`,
          userAnswer: res.correct ? "(matched)" : "",
          correctAnswer: h.correctAnswers[0] ?? "",
          correct: res.correct,
        });
      });
    }

    // 5. Options (Multiple choice / checkboxes)
    if (this.options.length > 0) {
      const isMultiSelect =
        Array.isArray(rawAnswer) ||
        Array.isArray(rawObj.selectedOptions) ||
        Array.isArray(rawObj.selected) ||
        Array.isArray(rawObj.options) ||
        this.options.filter((o) => o.isCorrect).length > 1;

      if (
        isMultiSelect &&
        (Array.isArray(rawAnswer) ||
          Array.isArray(rawObj.selectedOptions) ||
          Array.isArray(rawObj.selected) ||
          Array.isArray(rawObj.options))
      ) {
        // Checkboxes
        const list = Array.isArray(rawAnswer)
          ? rawAnswer
          : Array.isArray(rawObj.selectedOptions)
            ? rawObj.selectedOptions
            : Array.isArray(rawObj.selected)
              ? rawObj.selected
              : (rawObj.options as unknown[]);

        const userSet = new Set(
          list.map((v) => {
            if (typeof v === "number") return v;
            return this.options.findIndex((o) => norm(o.text) === norm(v));
          }),
        );

        this.options.forEach((opt, idx) => {
          const shouldSelect = opt.isCorrect;
          const wasSelected = userSet.has(idx);
          if (shouldSelect) {
            max += pointsPerItem;
            if (wasSelected) earned += pointsPerItem;
          }
          breakdown.push({
            label: opt.text,
            userAnswer: wasSelected,
            correctAnswer: shouldSelect,
            correct: shouldSelect === wasSelected,
          });
        });
      } else {
        // Single choice (multiple-choice)
        const correctOption = this.options.find((o) => o.isCorrect);
        let ok = false;
        let userAns: unknown = rawAnswer;

        if (typeof rawAnswer === "number") {
          ok = this.options[rawAnswer]?.isCorrect === true;
          userAns = this.options[rawAnswer]?.text ?? rawAnswer;
        } else if (typeof rawAnswer === "string") {
          ok = norm(rawAnswer) === norm(correctOption?.text);
        } else if (
          rawObj &&
          ("selectedOption" in rawObj ||
            "selected" in rawObj ||
            "answer" in rawObj)
        ) {
          const val =
            rawObj.selectedOption ?? rawObj.selected ?? rawObj.answer;
          if (typeof val === "number") {
            ok = this.options[val]?.isCorrect === true;
            userAns = this.options[val]?.text ?? val;
          } else {
            ok = norm(val) === norm(correctOption?.text);
            userAns = val;
          }
        }

        max += pointsPerItem;
        if (ok) earned += pointsPerItem;
        breakdown.push({
          label: "Answer",
          userAnswer: userAns,
          correctAnswer: correctOption?.text ?? null,
          correct: ok,
        });
      }
    }

    return {
      isCorrect: max > 0 && earned === max,
      score: earned,
      maxScore: max,
      requiresManualGrading: false,
      breakdown,
    };
  }

  toJSON(): Required<AnswerBlueprintProps> {
    return {
      gaps: this.gaps.map((g) => g.toJSON()),
      dropdowns: this.dropdowns.map((d) => d.toJSON()),
      hintWords: this.hintWords.map((h) => h.toJSON()),
      highlights: this.highlights.map((h) => h.toJSON()),
      options: this.options.map((o) => o.toJSON()),
    };
  }
}
