"use strict";

function normalizeFigure(input, unit) {
  if (input === null || input === undefined) {
    return { value: null, unit, status: "absent" };
  }

  if (typeof input !== "object") {
    return { value: input, unit, status: input === 0 ? "zero" : "ok" };
  }

  const value = input.value === null || input.value === undefined ? null : input.value;
  return {
    ...input,
    value,
    unit: input.unit ?? unit,
    status: input.status ?? (value === null ? "absent" : value === 0 ? "zero" : "ok")
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function defaultRenderFigure(figure) {
  const normalized = normalizeFigure(figure);
  const status = normalized.status;
  const placeholder = "&#8212;";
  const valueWithUnit = String(normalized.value) + (normalized.unit ? " " + normalized.unit : "");
  const text = normalized.value === null || status === "failed" ? placeholder :
    status === "partial" ? "~" + valueWithUnit : valueWithUnit;
  const description = normalized.reason || status;

  const safeText = text === placeholder ? placeholder : escapeHtml(text);
  return `<span class="cb-tu-figure" data-status="${escapeHtml(status)}" aria-description="${escapeHtml(description)}">${safeText}</span>`;
}

module.exports = { normalizeFigure, defaultRenderFigure };
