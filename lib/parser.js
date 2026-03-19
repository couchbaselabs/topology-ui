"use strict";

function isBufferLike(value) {
  return typeof Buffer !== "undefined" && Buffer.isBuffer(value);
}

function normalizeInput(input) {
  if (isBufferLike(input)) {
    return input.toString("utf8");
  }

  return input;
}

function asExpression(source) {
  const trimmed = source.trim();
  if (!trimmed) {
    throw new Error("Topology source is empty.");
  }

  return /^[\[{]/.test(trimmed) ? `(${trimmed})` : trimmed;
}

function evaluateJavaScriptObjectLiteral(source) {
  const expression = asExpression(source);

  try {
    const vm = require("node:vm");
    return vm.runInNewContext(expression, Object.create(null), { timeout: 1000 });
  } catch (error) {
    if (error && error.code !== "MODULE_NOT_FOUND") {
      throw error;
    }

    return Function(`"use strict"; return ${expression};`)();
  }
}

function parseTopologySource(input, options = {}) {
  const { allowJavaScript = true } = options;
  const normalized = normalizeInput(input);

  if (normalized && typeof normalized === "object") {
    return normalized;
  }

  if (typeof normalized !== "string") {
    throw new TypeError("Topology input must be an object, string, or Buffer.");
  }

  const source = normalized.trim();

  if (!source) {
    throw new Error("Topology source is empty.");
  }

  try {
    return JSON.parse(source);
  } catch (jsonError) {
    if (!allowJavaScript) {
      throw new SyntaxError(`Topology source is not valid JSON: ${jsonError.message}`);
    }
  }

  return evaluateJavaScriptObjectLiteral(source);
}

module.exports = {
  parseTopologySource
};
