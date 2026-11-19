import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import {
  Input,
  Select,
  Button,
  Checkbox,
  Modal,
  InputNumber,
  Switch,
  Space,
  message,
} from "antd";
import {
  FilterOutlined,
  MessageOutlined,
  EyeOutlined,
  PlusOutlined,
  DownOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import ExplanationEditor from "../Explanation/ExplanationEditor";

const { Option } = Select;

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const defaultSettings = {
  mode: "practice",
  revealAnswers: false,
  oneQuestionPerPage: false,
  showQuestionNumbers: true,
  shuffle: "none",
  timeLimit: 0,
  maxAttempts: "Unlimited",
  showFeedback: true,
  displayScore: true,
  specialChars: "",
  headerText: "",
  instructionText: "",
  quizCompleteMessage: "",
  showHeaderInput: false,
  showCompletionInput: false,
  showInstructionInput: false,
};

const DISPLAY_TOGGLES = [
  { key: "oneQuestionPerPage", label: "One question per page" },
  { key: "showQuestionNumbers", label: "Show question numbers" },
];

const SHUFFLE_OPTIONS = [
  { value: "none", label: "None" },
  { value: "questions", label: "Shuffle questions" },
  { value: "answers", label: "Shuffle answers" },
  { value: "both", label: "Shuffle questions & answers" },
];

const QUIZ_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

const MESSAGE_EDITORS = [
  { key: "headerText", label: "Header text" },
  { key: "instructionText", label: "Instruction text" },
  { key: "quizCompleteMessage", label: "Completion message" },
];

const FEEDBACK_TOGGLES = [
  { key: "showHeaderInput", label: "Show header input" },
  { key: "showInstructionInput", label: "Show instruction input" },
  { key: "showCompletionInput", label: "Show completion input" },
  { key: "showFeedback", label: "Show feedback" },
  { key: "displayScore", label: "Display score" },
];

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                        */
/* ------------------------------------------------------------------ */

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    {children}
  </div>
);

const Group = ({ title, children, className = "" }) => (
  <div
    className={`rounded-lg border border-slate-200 bg-slate-50/60 p-4 ${className}`}
  >
    {title && (
      <h4 className="mb-3 text-sm font-semibold text-slate-800">{title}</h4>
    )}
    {children}
  </div>
);

const ToggleRow = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between gap-4 rounded-md bg-white px-3 py-2.5 ring-1 ring-slate-200">
    <span className="text-sm text-slate-700">{label}</span>
    <Switch size="small" checked={checked} onChange={onChange} />
  </div>
);

const AccordionItem = ({
  icon,
  iconClass,
  title,
  open,
  onToggle,
  children,
}) => (
  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="flex w-full cursor-pointer items-center justify-between gap-3 border-0 bg-transparent px-5 py-4 text-left transition-colors hover:bg-slate-50"
    >
      <span className="flex items-center gap-3">
        <span className={`text-lg ${iconClass}`}>{icon}</span>
        <span className="text-[15px] font-semibold text-slate-900">
          {title}
        </span>
      </span>
      <DownOutlined
        className={`text-xs text-slate-400 transition-transform duration-200 ${
          open ? "rotate-180" : ""
        }`}
      />
    </button>
    {open && (
      <div className="border-t border-slate-200 px-5 py-5">{children}</div>
    )}
  </div>
);

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

const QuizInfo = ({ onQuizInfoChange, quizId, quizInfo = {} }) => {
  const quizVersion = quizInfo.version;
  const [title, setTitle] = useState(quizInfo.title || "");
  const [category, setCategory] = useState(quizInfo.category || "");
  const [uiSettings, setUiSettings] = useState({
    ...defaultSettings,
    ...quizInfo.uiSettings,
  });

  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const [visibleTo, setVisibleTo] = useState(quizInfo.visibleTo || "everyone");
  const [status, setStatus] = useState(quizInfo.status || "published");
  const [passingScore, setPassingScore] = useState(
    quizInfo.passingScore ?? 90,
  );
  const [availableClasses, setAvailableClasses] = useState([]);
  const [assignedClasses, setAssignedClasses] = useState(quizInfo.classes || []);

  const [activePanels, setActivePanels] = useState([]);

  const quizLink = `https://vestaedu.online/quiz/${quizId}`;

  const setSetting = (key, value) =>
    setUiSettings((prev) => ({ ...prev, [key]: value }));

  const togglePanel = (key) =>
    setActivePanels((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );

  /* ----------------------------- Effects ----------------------------- */

  useEffect(() => {
    onQuizInfoChange({
      title,
      category,
      uiSettings,
      visibleTo,
      status,
      passingScore,
      classes: assignedClasses,
      version: quizVersion,
    });
  }, [
    title,
    category,
    uiSettings,
    visibleTo,
    status,
    passingScore,
    assignedClasses,
    quizVersion,
    onQuizInfoChange,
  ]);

  useEffect(() => {
    axios
      .get(`${config.API_URL}/api/categories`)
      .then((res) => setCategories(res.data.map((c) => c.name)))
      .catch((err) => console.error("Lỗi khi lấy danh mục:", err));
  }, []);

  useEffect(() => {
    if (visibleTo === "classes") {
      axios
        .get(`${config.API_URL}/api/classes`)
        .then((res) => setAvailableClasses(res.data))
        .catch((err) => console.error("Lỗi khi lấy danh sách lớp:", err));
    }
  }, [visibleTo]);

  useEffect(() => {
    if (quizId && assignedClasses.length > 0) {
      assignedClasses.forEach((classId) => {
        axios
          .post(`${config.API_URL}/api/classes/${classId}/add-quiz`, { quizId })
          .catch((err) => console.error("Không thể gán quiz vào class:", err));
      });
    }
  }, [assignedClasses, quizId]);

  /* ----------------------------- Handlers ---------------------------- */

  const handleSaveCategory = async () => {
    try {
      const res = await axios.post(`${config.API_URL}/api/categories`, {
        name: newCategory,
      });
      const newCat = res.data.name;
      setCategories((prev) => [...prev, newCat]);
      setCategory(newCat);
      setNewCategory("");
      setShowCategoryModal(false);
      message.success("Category added successfully!");
    } catch (err) {
      message.error("❌ Không thể thêm danh mục");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(quizLink);
    message.success("Link copied to clipboard!");
  };

  const toggleClass = (classId, checked) =>
    setAssignedClasses((prev) =>
      checked ? [...prev, classId] : prev.filter((id) => id !== classId),
    );

  /* ------------------------------ Render ----------------------------- */

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <header>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Quiz settings
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Configure your quiz settings and options.
        </p>
      </header>

      {/* Basic info */}
      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <Field label="Quiz title">
          <Input
            size="large"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your quiz title..."
          />
        </Field>
        <Field label="Publication status">
          <Select value={status} onChange={setStatus}>
            {QUIZ_STATUS_OPTIONS.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Field>

        <Field label="Category">
          <Space.Compact style={{ width: "100%" }}>
            <Select
              size="large"
              className="flex-1"
              value={category}
              onChange={setCategory}
              placeholder="Select a category"
            >
              <Option value="">Select a category</Option>
              {categories.map((cat, index) => (
                <Option key={index} value={cat}>
                  {cat}
                </Option>
              ))}
            </Select>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => setShowCategoryModal(true)}
              title="Add new category"
            >
              Add
            </Button>
          </Space.Compact>
        </Field>
      </section>

      {/* Advanced settings */}
      <div className="space-y-3">
        {/* 1. Display & order */}
        <AccordionItem
          icon={<FilterOutlined />}
          iconClass="text-blue-500"
          title="Display & order"
          open={activePanels.includes("1")}
          onToggle={() => togglePanel("1")}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Group title="Display options">
              <div className="space-y-2">
                {DISPLAY_TOGGLES.map(({ key, label }) => (
                  <ToggleRow
                    key={key}
                    label={label}
                    checked={uiSettings[key]}
                    onChange={(checked) => setSetting(key, checked)}
                  />
                ))}
              </div>
            </Group>

            <Group title="Question order">
              <Field label="Shuffle mode">
                <Select
                  className="w-full"
                  value={uiSettings.shuffle}
                  onChange={(value) => setSetting("shuffle", value)}
                >
                  {SHUFFLE_OPTIONS.map((opt) => (
                    <Option key={opt.value} value={opt.value}>
                      {opt.label}
                    </Option>
                  ))}
                </Select>
              </Field>
            </Group>

            <Group title="Quiz limits">
              <Field label="Mode">
                <Select
                  className="w-full"
                  value={uiSettings.mode}
                  onChange={(value) => setSetting("mode", value)}
                >
                  <Option value="practice">Practice</Option>
                  <Option value="exam">Exam</Option>
                </Select>
              </Field>
              <Field label="Time limit (minutes)">
                <InputNumber
                  className="w-full"
                  min={0}
                  value={uiSettings.timeLimit || 0}
                  onChange={(value) => setSetting("timeLimit", value || 0)}
                  placeholder="0 = No limit"
                />
              </Field>
            </Group>

            <Group title="Attempts">
              <Field label="Passing score (%)">
                <InputNumber
                  className="w-full"
                  min={0}
                  max={100}
                  value={passingScore}
                  onChange={(value) => setPassingScore(value ?? 90)}
                />
              </Field>
              <Field label="Max attempts">
                <Select
                  className="w-full"
                  value={uiSettings.maxAttempts}
                  onChange={(value) => setSetting("maxAttempts", value)}
                >
                  <Option value="Unlimited">Unlimited</Option>
                  {[1, 2, 3, 4, 5].map((attempt) => (
                    <Option key={attempt} value={attempt}>
                      {attempt}
                    </Option>
                  ))}
                </Select>
              </Field>
              {uiSettings.mode === "exam" && (
                <ToggleRow
                  label="Reveal answers after submission"
                  checked={uiSettings.revealAnswers}
                  onChange={(checked) => setSetting("revealAnswers", checked)}
                />
              )}
            </Group>
          </div>
        </AccordionItem>

        {/* 2. Feedback & messages */}
        <AccordionItem
          icon={<MessageOutlined />}
          iconClass="text-emerald-500"
          title="Feedback & messages"
          open={activePanels.includes("2")}
          onToggle={() => togglePanel("2")}
        >
          <div className="space-y-4">
            {MESSAGE_EDITORS.map(({ key, label }) => (
              <Group key={key} title={label}>
                <ExplanationEditor
                  value={uiSettings[key]}
                  onChange={(val) => setSetting(key, val)}
                />
              </Group>
            ))}

            <Group title="Display options">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {FEEDBACK_TOGGLES.map(({ key, label }) => (
                  <ToggleRow
                    key={key}
                    label={label}
                    checked={uiSettings[key]}
                    onChange={(checked) => setSetting(key, checked)}
                  />
                ))}
              </div>
            </Group>

            <Field label="Special characters">
              <Input
                value={uiSettings.specialChars}
                onChange={(e) => setSetting("specialChars", e.target.value)}
                placeholder="Enter special characters..."
              />
            </Field>
          </div>
        </AccordionItem>

        {/* 3. Visibility */}
        <AccordionItem
          icon={<EyeOutlined />}
          iconClass="text-amber-500"
          title="Visibility"
          open={activePanels.includes("3")}
          onToggle={() => togglePanel("3")}
        >
          <div className="space-y-4">
            <Field label="Quiz link">
              <Space.Compact style={{ width: "100%" }}>
                <Input value={quizLink} disabled className="font-mono" />
                <Button
                  type="primary"
                  icon={<CopyOutlined />}
                  onClick={handleCopyLink}
                >
                  Copy
                </Button>
              </Space.Compact>
            </Field>

            <Field label="Visible to">
              <Select
                className="w-full"
                value={visibleTo}
                onChange={setVisibleTo}
              >
                <Option value="everyone">Everyone</Option>
                <Option value="everyone_record">
                  Everyone (record answers)
                </Option>
                <Option value="classes">Learnclick classes</Option>
                <Option value="just_me">Just me</Option>
              </Select>
            </Field>

            {visibleTo === "classes" && (
              <Group title="Assign to classes">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {availableClasses.map((cls) => {
                    const checked = assignedClasses.includes(cls.id);
                    return (
                      <label
                        key={cls.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-md border bg-white px-3 py-2.5 text-sm transition-colors ${
                          checked
                            ? "border-blue-500 text-blue-600"
                            : "border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <Checkbox
                          checked={checked}
                          onChange={(e) =>
                            toggleClass(cls.id, e.target.checked)
                          }
                        />
                        <span className="font-medium">{cls.name}</span>
                      </label>
                    );
                  })}
                </div>
              </Group>
            )}
          </div>
        </AccordionItem>
      </div>

      {/* Category modal */}
      <Modal
        title="Add new category"
        open={showCategoryModal}
        onOk={handleSaveCategory}
        onCancel={() => setShowCategoryModal(false)}
        okText="Save"
        cancelText="Cancel"
      >
        <Input
          size="large"
          autoFocus
          placeholder="Enter category name..."
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onPressEnter={handleSaveCategory}
        />
      </Modal>
    </div>
  );
};

export default QuizInfo;
