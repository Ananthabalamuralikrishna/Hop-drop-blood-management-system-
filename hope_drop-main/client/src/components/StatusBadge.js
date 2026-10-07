import React from "react";
import "./StatusBadge.css";

function StatusBadge({ status }) {
  const normalized = (status || "").toLowerCase();
  let className = "status-badge status-pending";

  if (normalized === "approved") {
    className = "status-badge status-approved";
  } else if (normalized === "rejected") {
    className = "status-badge status-rejected";
  }

  return <span className={className}>{status}</span>;
}

export default StatusBadge;

