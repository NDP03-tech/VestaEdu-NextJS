import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { convertOldClozeDropLinks } from "../../utils/convertLegacyCloze.js";
import "./styles.css";
import config from "../../config";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const TINYMCE_API_KEY = "n37usgxk136y7jbgbd22rrry2ki2agrdp3zzkfg8gc0adi22";

const FONT_AWESOME_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";

const CONTENT_STYLE = `
  @import url('${FONT_AWESOME_URL}');

  .hint-wrapper {
    margin-right: 0 !important;
    white-space: normal !important;
  }

  .hint-wrapper + * {
    margin-left: 0 !important;
  }

  .hint-icon {
    font-size: 0.85em;
    margin-left: 4px;
    cursor: pointer;
    top: -2px;
    left: -2px;
    position: relative;
    display: inline;
  }

  .hint-icon::after {
    content: attr(data-hint);
    position: absolute;
    top: -30px;
    left: 0;
    transform: translateX(10px);
    background-color: #333;
    color: #fff;
    padding: 6px 5px;
    border-radius: 6px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    font-family: "Segoe UI", "Helvetica Neue", "Arial", "sans-serif";
    transition: opacity 0.3s ease;
    unicode-bidi: isolate;
    z-index: 9999;
  }

  .hint-icon:hover::after {
    opacity: 1;
  }

  .cloze,
  .dropdown,
  .hint-wrapper {
    background-color: #ffd6d6;
    color: #b30000;
    padding: 2px 4px;
    border-radius: 4px;
    display: inline-block;
  }

  /* Bỏ gạch chân của thẻ <a> */
  a.cloze, a.dropdown {
    text-decoration: none !important;
  }

  .dropdown-icon {
    font-size: 0.5em;
    margin-left: 4px;
    display: inline;
    color: #555;
  }
`;

const PLUGINS = [
  "advlist",
  "autolink",
  "lists",
  "link",
  "image",
  "charmap",
  "preview",
  "anchor",
  "searchreplace",
  "visualblocks",
  "code",
  "fullscreen",
  "insertdatetime",
  "media",
  "table",
  "help",
  "wordcount",
];

const TOOLBAR =
  " createGap createMultipleGap deleteGap hintWord dropdownButton | bold italic underline | bullist numlist outdent indent | link image code";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const getSelectedText = (editor) =>
  editor.selection.getContent({ format: "text" }).trim();

const getTextPosition = (editor, text) =>
  editor.getContent({ format: "text" }).indexOf(text);

const toEncodedJson = (value) => JSON.stringify(value).replace(/"/g, "&quot;");

const uploadMedia = (formData) =>
  fetch(`${config.API_URL}/api/upload-media`, {
    method: "POST",
    body: formData,
  }).then((res) => res.json());

/* Chọn ảnh từ máy -> upload -> trả URL về cho TinyMCE */
const pickImage = (callback, value, meta) => {
  if (meta.filetype !== "image") return;

  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");

  input.onchange = function () {
    const file = this.files[0];
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = function () {
      const formData = new FormData();
      formData.append("file", file);

      uploadMedia(formData)
        .then((json) => {
          if (json.fileUrl) {
            callback(json.fileUrl, {
              alt: file.name || "",
              width: img.width,
              height: img.height,
              style: `width: ${img.width}px; height: auto;`,
            });
          } else {
            alert("Không nhận được URL ảnh từ server");
          }
        })
        .catch((err) => {
          alert("Lỗi upload ảnh: " + err.message);
        });

      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  input.click();
};

/* Upload ảnh dán/kéo thả vào editor */
const uploadImageHandler = (blobInfo, success, failure) => {
  const formData = new FormData();
  formData.append("file", blobInfo.blob(), blobInfo.filename());

  uploadMedia(formData)
    .then((json) => {
      if (json.fileUrl) {
        success(json.fileUrl);
      } else {
        failure("Không nhận được fileUrl từ backend");
      }
    })
    .catch((err) => {
      failure("Lỗi upload: " + err.message);
    });
};

/* ------------------------------------------------------------------ */
/* Toolbar buttons                                                     */
/* ------------------------------------------------------------------ */

const setupEditor = (
  editor,
  {
    onCreateGap,
    onCreateMultipleGap,
    onDeleteGap,
    onAddHint,
    onCreateDropdown,
  },
) => {
  // Convert các link cloze/dropdown kiểu cũ khi paste hoặc load nội dung
  const convertLegacy = () =>
    setTimeout(() => convertOldClozeDropLinks(editor.getBody()), 10);
  editor.on("Paste PostProcess LoadContent SetContent", convertLegacy);

  /* ---- Dropdown ---- */
  editor.ui.registry.addMenuButton("dropdownButton", {
    text: "Dropdown",
    fetch: () => {
      const selectedText = getSelectedText(editor);
      if (!selectedText) {
        alert("Please select text first.");
        return;
      }

      editor.windowManager.open({
        title: "Enter Options",
        body: {
          type: "panel",
          items: [
            {
              type: "htmlpanel",
              html: `<p><strong>Selected Text (Correct Answer):</strong> ${selectedText}</p>`,
            },
            { type: "input", name: "value1", label: "Option 1" },
            { type: "input", name: "value2", label: "Option 2" },
            { type: "input", name: "value3", label: "Option 3" },
          ],
        },
        buttons: [
          { type: "submit", text: "Insert Dropdown", primary: true },
          { type: "cancel", text: "Cancel" },
        ],
        onSubmit: (api) => {
          const data = api.getData();
          const options = [
            selectedText,
            data.value1,
            data.value2,
            data.value3,
          ].filter((opt) => opt && opt.trim() !== "");

          const dropdownHTML = `<a class="cloze dropdown" data-answer="${selectedText}" data-options="${toEncodedJson(
            options,
          )}" href="#">${selectedText}<span class="dropdown-icon">&#9660;</span></a>`;

          editor.insertContent(dropdownHTML);

          if (onCreateDropdown) {
            onCreateDropdown({
              correct_answer: selectedText,
              options,
              position: editor.selection.getRng().startOffset,
              length: selectedText.length,
            });
          }
          api.close();
        },
      });
    },
  });

  /* ---- Create gap ---- */
  editor.ui.registry.addButton("createGap", {
    text: "Create Gap",
    onAction: () => {
      const selectedText = getSelectedText(editor);
      if (!selectedText) {
        alert("Please select text to create a gap.");
        return;
      }

      const startPosition = getTextPosition(editor, selectedText);
      onCreateGap && onCreateGap(selectedText, startPosition);
      editor.selection.setContent(
        `<a class="cloze" href="#">${selectedText}</a>`,
      );
    },
  });

  /* ---- Delete gap ---- */
  editor.ui.registry.addButton("deleteGap", {
    text: "Delete Gap",
    onAction: () => {
      const selectedNode = editor.selection.getNode();
      if (
        selectedNode.tagName === "A" &&
        selectedNode.classList.contains("cloze")
      ) {
        const innerText = selectedNode.textContent;
        editor.selection.select(selectedNode);
        editor.selection.setContent(innerText);
        if (onDeleteGap) onDeleteGap(innerText);
      } else {
        alert("Please select a gap to delete.");
      }
    },
  });

  /* ---- Hint ---- */
  editor.ui.registry.addButton("hintWord", {
    text: "Hint ",
    onAction: () => {
      const selectedText = getSelectedText(editor);
      if (!selectedText) {
        alert("Please select text to add a hint.");
        return;
      }

      editor.windowManager.open({
        title: "Add/Edit Hint",
        body: {
          type: "panel",
          items: [
            {
              type: "htmlpanel",
              html: `<p><strong>Gap Word:</strong> ${selectedText}</p>`,
            },
            { type: "textarea", name: "hint", label: "Hint" },
          ],
        },
        buttons: [
          { type: "submit", text: "Create", primary: true },
          { type: "cancel", text: "Cancel" },
        ],
        onSubmit: (api) => {
          const hintText = api.getData().hint?.trim();
          if (!hintText) {
            alert("Please enter a hint.");
            return;
          }

          const encodedHint = hintText
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;");

          editor.insertContent(
            `<span class="hint-wrapper"><span class="cloze">${selectedText}</span><i class="fa-solid fa-circle-info hint-icon" data-hint="${encodedHint}"></i></span>`,
          );

          if (typeof onAddHint === "function") {
            onAddHint(selectedText, hintText);
          }
          api.close();
        },
      });
    },
  });

  /* ---- Multiple gaps ---- */
  editor.ui.registry.addButton("createMultipleGap", {
    text: "Multiple Gaps",
    onAction: () => {
      const selectedText = getSelectedText(editor);
      if (!selectedText || !selectedText.includes("#")) {
        alert(
          "Use '#' to separate multiple correct answers. E.g., here#there#at home",
        );
        return;
      }

      const answers = selectedText
        .split("#")
        .map((ans) => ans.trim())
        .filter(Boolean);
      const startPosition = getTextPosition(editor, selectedText);

      editor.selection.setContent(
        `<a class="cloze" data-answers="${toEncodedJson(
          answers,
        )}" href="#">${selectedText}</a>`,
      );

      if (onCreateMultipleGap) {
        onCreateMultipleGap(selectedText, startPosition);
      }
    },
  });
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const createInit = (handlers) => ({
  height: 400,
  content_style: CONTENT_STYLE,
  menubar: false,
  verify_html: false,
  content_css: FONT_AWESOME_URL,
  cleanup: false,
  inline_styles: true,
  entity_encoding: "raw",
  forced_root_block: false,
  valid_elements: "*[*]", // Cho phép mọi thẻ và mọi thuộc tính
  extended_valid_elements:
    "a[class|href|title|data-*],span[class|title|data-*],i[class|data-*]",
  custom_elements: "a,span",
  valid_children: "+body[span],+span[span],+body[a],+span[a]",
  allow_html_in_named_anchor: true,
  plugins: PLUGINS,
  toolbar: TOOLBAR,

  // Upload ảnh
  file_picker_types: "image",
  file_picker_callback: pickImage,
  images_upload_url: `${config.API_URL}/api/upload-media`,
  images_upload_handler: uploadImageHandler,

  setup: (editor) => setupEditor(editor, handlers),
});

const RichTextEditor = ({
  value,
  onChange,
  onCreateGap,
  onCreateMultipleGap,
  onDeleteGap,
  onAddHint,
  onCreateDropdown,
}) => (
  <Editor
    apiKey={TINYMCE_API_KEY}
    value={value}
    init={createInit({
      onCreateGap,
      onCreateMultipleGap,
      onDeleteGap,
      onAddHint,
      onCreateDropdown,
    })}
    onEditorChange={(content) => onChange(content)}
  />
);

export default RichTextEditor;
