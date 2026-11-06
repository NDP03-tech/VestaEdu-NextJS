import React from "react";
import OptionsEditor from "./OptionsEditor";

const MultipleChoiceEditor = ({ options, setOptions }) => (
  <OptionsEditor variant="single" options={options} setOptions={setOptions} />
);

export default MultipleChoiceEditor;
