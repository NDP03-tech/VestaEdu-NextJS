const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'GeneratedDropdownRenderer.js');
let code = fs.readFileSync(file, 'utf8');

const target = `  return (
    <div
      ref={containerRef}
      className="rendered-question"
      style={{
        fontSize: "16px",
        lineHeight: "2",
        color: "#262626",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
      dangerouslySetInnerHTML={{ __html: question.question_text }}
    />
  );`;

const replacement = `  return (
    <div
      ref={containerRef}
      className="rendered-question text-base leading-loose text-slate-800 p-5 bg-white rounded-xl border border-slate-200 shadow-sm"
      dangerouslySetInnerHTML={{ __html: question.question_text }}
    />
  );`;

if (code.replace(/\r\n/g, '\n').includes(target.replace(/\r\n/g, '\n'))) {
  const isCRLF = code.includes('\r\n');
  code = code.replace(/\r\n/g, '\n').replace(target.replace(/\r\n/g, '\n'), replacement);
  if (isCRLF) code = code.replace(/\n/g, '\r\n');
  fs.writeFileSync(file, code, 'utf8');
  console.log('Successfully modernized GeneratedDropdownRenderer container');
} else {
  console.log('Target not found in GeneratedDropdownRenderer');
}

