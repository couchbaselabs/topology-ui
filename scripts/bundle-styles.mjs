import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const tailwindCssPath = path.join(rootDir, "dist", "topology-ui.css");
const fontAwesomeCssPath = path.join(rootDir, "node_modules", "@fortawesome", "fontawesome-free", "css", "all.min.css");
const fontAwesomeFontsPath = path.join(rootDir, "node_modules", "@fortawesome", "fontawesome-free", "webfonts");
const distWebfontsPath = path.join(rootDir, "dist", "webfonts");

const tailwindCss = await readFile(tailwindCssPath, "utf8");
const fontAwesomeCss = (await readFile(fontAwesomeCssPath, "utf8"))
  .replace(/\.\.\/webfonts\//g, "./webfonts/");

await rm(distWebfontsPath, { recursive: true, force: true });
await mkdir(distWebfontsPath, { recursive: true });
await cp(fontAwesomeFontsPath, distWebfontsPath, { recursive: true });

await writeFile(
  tailwindCssPath,
  `${tailwindCss}\n${fontAwesomeCss}\n`,
  "utf8"
);
