"use strict";

const renderRootClass = "cb-topology-renderer";
const rendererUtilityClassPrefix = "cb-tu-";
const rendererSemanticClassPrefixes = ["cb-tr-"];

function isFontAwesomeClass(token) {
  return /^fa([bdrslt])?$/.test(token) || /^fa-[A-Za-z0-9-]+$/.test(token);
}

function isLibraryOwnedClass(token) {
  if (!token) {
    return false;
  }

  return token === renderRootClass ||
    token.startsWith(rendererUtilityClassPrefix) ||
    rendererSemanticClassPrefixes.some((prefix) => token.startsWith(prefix));
}

function shouldPrefixClassToken(token) {
  return !!token && !isLibraryOwnedClass(token) && !isFontAwesomeClass(token);
}

function prefixUtilityClassName(token) {
  return shouldPrefixClassToken(token) ? `${rendererUtilityClassPrefix}${token}` : token;
}

function prefixClassList(classList) {
  return classList
    .split(/\s+/)
    .filter(Boolean)
    .map(prefixUtilityClassName)
    .join(" ");
}

function prefixHtmlClassAttributes(html) {
  return html.replace(/\bclass=(["'])(.*?)\1/g, (match, quote, classList) => (
    `class=${quote}${prefixClassList(classList)}${quote}`
  ));
}

function unescapeCssClassName(selectorClassName) {
  return selectorClassName.replace(/\\(.)/g, "$1");
}

function escapeCssClassName(className) {
  return className.replace(/([^A-Za-z0-9_-])/g, "\\$1");
}

function prefixCssSelectorClasses(selector) {
  let output = "";

  for (let index = 0; index < selector.length; index += 1) {
    const char = selector[index];

    if (char !== ".") {
      output += char;
      continue;
    }

    let className = "";
    let cursor = index + 1;

    while (cursor < selector.length) {
      const current = selector[cursor];

      if (current === "\\") {
        if (cursor + 1 >= selector.length) {
          className += current;
          cursor += 1;
          continue;
        }

        className += current + selector[cursor + 1];
        cursor += 2;
        continue;
      }

      if (/[A-Za-z0-9_-]/.test(current)) {
        className += current;
        cursor += 1;
        continue;
      }

      break;
    }

    if (!className) {
      output += char;
      continue;
    }

    const unescapedClassName = unescapeCssClassName(className);
    const prefixedClassName = prefixUtilityClassName(unescapedClassName);
    output += `.${escapeCssClassName(prefixedClassName)}`;
    index = cursor - 1;
  }

  return output;
}

module.exports = {
  escapeCssClassName,
  prefixClassList,
  prefixCssSelectorClasses,
  prefixHtmlClassAttributes,
  prefixUtilityClassName,
  renderRootClass,
  rendererSemanticClassPrefixes,
  rendererUtilityClassPrefix,
  shouldPrefixClassToken
};
