import React from "react";
import RichTextEditor from "./RichTextEditor";
import EditorSection from "./EditorSection";

const ReadingTaskEditor = ({
  readingContent,
  setReadingContent,
  questionText,
  setQuestionText,
  onCreateGap,
  onCreateMultipleGap,
  onDeleteGap,
  onAddHint,
  onCreateDropdown,
}) => (
  <div className="space-y-5">
    <EditorSection label="Bài đọc">
      <RichTextEditor value={readingContent} onChange={setReadingContent} />
    </EditorSection>

    <EditorSection label="Câu hỏi">
      <RichTextEditor
        value={questionText}
        onChange={setQuestionText}
        onCreateGap={onCreateGap}
        onCreateMultipleGap={onCreateMultipleGap}
        onDeleteGap={onDeleteGap}
        onAddHint={onAddHint}
        onCreateDropdown={onCreateDropdown}
      />
    </EditorSection>
  </div>
);

export default ReadingTaskEditor;
