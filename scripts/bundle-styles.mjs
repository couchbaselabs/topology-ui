import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const { prefixCssSelectorClasses } = require("../lib/class-prefix");

const tailwindCssPath = path.join(rootDir, "dist", "topology-ui.css");
const fontAwesomeCssPath = path.join(rootDir, "node_modules", "@fortawesome", "fontawesome-free", "css", "all.min.css");
const fontAwesomeFontsPath = path.join(rootDir, "node_modules", "@fortawesome", "fontawesome-free", "webfonts");
const distWebfontsPath = path.join(rootDir, "dist", "webfonts");
const hostSafeCssPath = path.join(rootDir, "build", "host-safe.css");
const scopeSelector = ".cb-topology-renderer";

function splitSelectors(selectorList) {
  const selectors = [];
  let current = "";
  let parenthesesDepth = 0;
  let bracketsDepth = 0;

  for (let index = 0; index < selectorList.length; index += 1) {
    const char = selectorList[index];

    if (char === "(") {
      parenthesesDepth += 1;
    } else if (char === ")") {
      parenthesesDepth = Math.max(0, parenthesesDepth - 1);
    } else if (char === "[") {
      bracketsDepth += 1;
    } else if (char === "]") {
      bracketsDepth = Math.max(0, bracketsDepth - 1);
    }

    if (char === "," && parenthesesDepth === 0 && bracketsDepth === 0) {
      selectors.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  if (current) {
    selectors.push(current);
  }

  return selectors;
}

function prefixSelector(selector) {
  const trimmed = selector.trim();

  if (!trimmed) {
    return [];
  }

  if (trimmed.startsWith(scopeSelector)) {
    return [trimmed];
  }

  if (trimmed === "*") {
    return [`${scopeSelector} *`];
  }

  if (/^(html|body|:root)(?=$|[\s>+~[:.#])/.test(trimmed)) {
    return [trimmed.replace(/^(html|body|:root)(?=$|[\s>+~[:.#])/, scopeSelector)];
  }

  return [`${scopeSelector} ${trimmed}`];
}

function findBlockEnd(css, startIndex) {
  let depth = 1;
  let quote = null;

  for (let index = startIndex; index < css.length; index += 1) {
    const char = css[index];
    const nextChar = css[index + 1];

    if (quote) {
      if (char === "\\" && nextChar) {
        index += 1;
        continue;
      }
      if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === "\"" || char === "'") {
      quote = char;
      continue;
    }

    if (char === "/" && nextChar === "*") {
      const commentEnd = css.indexOf("*/", index + 2);
      if (commentEnd === -1) {
        return css.length - 1;
      }
      index = commentEnd + 1;
      continue;
    }

    if (char === "{") {
      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }

  return css.length - 1;
}

function scopeCss(css, selectorTransform = (selector) => selector) {
  let output = "";
  let index = 0;

  while (index < css.length) {
    const char = css[index];

    if (/\s/.test(char)) {
      output += char;
      index += 1;
      continue;
    }

    if (char === "/" && css[index + 1] === "*") {
      const commentEnd = css.indexOf("*/", index + 2);
      const end = commentEnd === -1 ? css.length : commentEnd + 2;
      output += css.slice(index, end);
      index = end;
      continue;
    }

    if (char === "@") {
      const blockStart = css.indexOf("{", index);
      const statementEnd = css.indexOf(";", index);

      if (statementEnd !== -1 && (blockStart === -1 || statementEnd < blockStart)) {
        output += css.slice(index, statementEnd + 1);
        index = statementEnd + 1;
        continue;
      }

      if (blockStart === -1) {
        output += css.slice(index);
        break;
      }

      const atRuleHeader = css.slice(index, blockStart + 1);
      const blockEnd = findBlockEnd(css, blockStart + 1);
      const blockBody = css.slice(blockStart + 1, blockEnd);

      if (/^@(-webkit-)?keyframes/i.test(atRuleHeader) || /^@font-face/i.test(atRuleHeader)) {
        output += `${atRuleHeader}${blockBody}}`;
      } else {
        output += `${atRuleHeader}${scopeCss(blockBody, selectorTransform)}}`;
      }

      index = blockEnd + 1;
      continue;
    }

    const blockStart = css.indexOf("{", index);
    if (blockStart === -1) {
      output += css.slice(index);
      break;
    }

    const selectorList = css.slice(index, blockStart);
    const blockEnd = findBlockEnd(css, blockStart + 1);
    const declarations = css.slice(blockStart + 1, blockEnd);
    const scopedSelectors = splitSelectors(selectorList)
      .map(selectorTransform)
      .flatMap(prefixSelector)
      .join(",");

    output += `${scopedSelectors}{${declarations}}`;
    index = blockEnd + 1;
  }

  return output;
}

const tailwindCss = await readFile(tailwindCssPath, "utf8");
const hostSafeCss = await readFile(hostSafeCssPath, "utf8");
const fontAwesomeCss = (await readFile(fontAwesomeCssPath, "utf8"))
  .replace(/\.\.\/webfonts\//g, "./webfonts/");
const bundledCss = [
  scopeCss(tailwindCss, prefixCssSelectorClasses),
  scopeCss(hostSafeCss),
  scopeCss(fontAwesomeCss)
].join("\n");

await rm(distWebfontsPath, { recursive: true, force: true });
await mkdir(distWebfontsPath, { recursive: true });
await cp(fontAwesomeFontsPath, distWebfontsPath, { recursive: true });

await writeFile(
  tailwindCssPath,
  bundledCss,
  "utf8"
);
