import React from "react";
import "./ToggleTabs.css";

function ToggleTabs({ options, active, onChange }) {
  return (
    <div className="toggle-tabs">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={
            active === opt.value
              ? "toggle-tab toggle-tab-active"
              : "toggle-tab"
          }
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default ToggleTabs;

