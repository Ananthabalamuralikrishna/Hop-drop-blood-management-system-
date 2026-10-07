import React from "react";
import "./Input.css";

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  ...rest
}) {
  const inputClass = error ? "input-field input-error" : "input-field";

  return (
    <div className="input-group">
      {label && (
        <label className="input-label" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        className={inputClass}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...rest}
      />
      {error && <div className="input-error-text">{error}</div>}
    </div>
  );
}

export default Input;

