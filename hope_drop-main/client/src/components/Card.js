import React from "react";
import "./Card.css";

function Card({ title, children, className = "" }) {
  const rootClass = className ? `card ${className}` : "card";
  return (
    <div className={rootClass}>
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">{children}</div>
    </div>
  );
}

export default Card;

