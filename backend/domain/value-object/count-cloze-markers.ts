// =====================================================
// countClozeMarkers
// =====================================================
// Đếm số lượng marker .cloze trong questionText (HTML), phân loại theo class,
// mô phỏng ĐÚNG cách BlankBoxesRenderer.js / DragDropRichRenderer.js /
// GeneratedDropdownRenderer.js (FE) phân loại khi render:
//
//   const isDropdown = el.classList.contains("dropdown");
//   const isHint = el.closest(".hint-wrapper")
//                || el.classList.contains("hint")
//                || el.classList.contains("hint-word");
//   -> còn lại (không dropdown, không hint) = gap
//
// Lý do cần hàm này: FE sinh key gap_N/dropdown_N/hint_N bằng cách ĐẾM THEO
// THỨ TỰ XUẤT HIỆN trong DOM, KHÔNG dùng field `index` lưu trong DB. Nếu số
// lượng phần tử trong gaps[]/dropdowns[]/hintWords[] không khớp đúng số
// marker tương ứng trong questionText, chấm điểm sẽ lệch/sai mà không có
// dấu hiệu báo lỗi nào ở runtime - vì vậy phải validate ngay lúc create/update.
//
// ⚠️ Đây là HEURISTIC bằng regex (BE không có DOM parser đầy đủ như trình
// duyệt). Trường hợp `hint` được đánh dấu bằng <span class="hint-wrapper">
// bao NGOÀI thẻ <a class="cloze"> (thay vì chính thẻ <a> mang class hint)
// vẫn được xử lý bằng cách quét cửa sổ ký tự lân cận, nhưng chưa được test
// với toàn bộ markup thật do QuestionFormTest.js (FE) sinh ra - nên coi đây
// là validate "best-effort", cần đối chiếu thêm với dữ liệu thật trước khi
// tin tưởng tuyệt đối.
// =====================================================

export interface ClozeCounts {
  gaps: number;
  dropdowns: number;
  hints: number;
}

const CLOZE_TAG_REGEX = /<a\b([^>]*)>/gi;
const CLASS_ATTR_REGEX = /class\s*=\s*"([^"]*)"/i;
/** Cửa sổ ký tự tối đa để tìm .hint-wrapper bao ngoài thẻ <a class="cloze"> */
const HINT_WRAPPER_LOOKBEHIND = 60;

export function countClozeMarkers(html: string): ClozeCounts {
  const counts: ClozeCounts = { gaps: 0, dropdowns: 0, hints: 0 };
  if (!html) return counts;

  let match: RegExpExecArray | null;
  CLOZE_TAG_REGEX.lastIndex = 0;

  while ((match = CLOZE_TAG_REGEX.exec(html)) !== null) {
    const attrs = match[1] ?? "";
    const classMatch = CLASS_ATTR_REGEX.exec(attrs);
    const cls = classMatch?.[1] ?? "";

    if (!/\bcloze\b/.test(cls)) continue;

    const isDropdown = /\bdropdown\b/.test(cls);
    const isHintByClass = /\bhint(-word)?\b/.test(cls);

    const before = html.slice(
      Math.max(0, match.index - HINT_WRAPPER_LOOKBEHIND),
      match.index,
    );
    const isHintByWrapper = /class="[^"]*hint-wrapper[^"]*"[^>]*$/.test(before);

    if (isDropdown) counts.dropdowns++;
    else if (isHintByClass || isHintByWrapper) counts.hints++;
    else counts.gaps++;
  }

  return counts;
}
