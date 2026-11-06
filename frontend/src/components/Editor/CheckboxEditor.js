import React from "react";
import OptionsEditor from "./OptionsEditor";

const CheckboxesEditor = ({ options = [], setOptions }) => (
  <OptionsEditor variant="multiple" options={options} setOptions={setOptions} />
);

export default CheckboxesEditor;
