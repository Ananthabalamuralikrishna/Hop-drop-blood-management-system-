import React from "react";
import "./Button.css";

function Button({ children, variant = "primary", type = "button", ...rest }) {
  const className = `btn btn-${variant}`;
  return (
    <button type={type} className={className} {...rest}>
      {children}
    </button>
  );
}

export default Button;

