// =====================================================
// HintWord Value Object
// =====================================================
// Ô điền chữ có gợi ý kèm theo (hiển thị hint, vẫn chấm như 1 gap thường).
// =====================================================
import { norm, type Reindexable } from "./shared";

export interface HintWordProps {
  index: number;
  word: string;
  hint?: string;
}

export interface CreateHintWordInput {
  index?: number;
  word: string;
  hint?: string;
}

export class HintWord implements Reindexable<HintWord> {
  private constructor(
    readonly index: number,
    readonly word: string,
    readonly hint?: string,
  ) {}

  static create(input: CreateHintWordInput): HintWord | null {
    const word = String(input.word ?? "").trim();
    if (!word) return null;
    const hint = input.hint?.trim();
    return new HintWord(input.index ?? 0, word, hint || undefined);
  }

  static reconstitute(props: HintWordProps): HintWord {
    return new HintWord(props.index, props.word ?? "", props.hint);
  }

  withIndex(index: number): HintWord {
    return new HintWord(index, this.word, this.hint);
  }

  grade(
    userValue: unknown,
    pointsPerItem: number,
  ): { earned: number; max: number; correct: boolean } {
    const ok = norm(userValue) === norm(this.word);
    return { earned: ok ? pointsPerItem : 0, max: pointsPerItem, correct: ok };
  }

  toJSON(): HintWordProps {
    return {
      index: this.index,
      word: this.word,
      ...(this.hint ? { hint: this.hint } : {}),
    };
  }
}
