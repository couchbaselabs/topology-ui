"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { defaultRenderFigure, normalizeFigure, renderTopology } = require("../index");

const plainNumberTopology = {
  name: "plain-numbers",
  resources: { memory: 256, cpus: 16 }
};

const topologyWithEveryFigure = {
  name: "figures",
  resources: { memory: 256, cpus: 16 },
  serverGroups: [{
    name: "sg",
    nodes: [{ name: "node", resources: { memory: 128, cpus: 8 }, services: ["Data"] }]
  }],
  buckets: [{
    name: "bucket",
    quota: 1024,
    documents: 1500,
    ratio: 75,
    replicas: 1,
    scopes: [{ name: "scope", documents: 1000, collections: [{ name: "collection", documents: 10 }] }]
  }]
};

function removeFigureWrappers(html) {
  return html.replace(/<span class="cb-tu-figure"[^>]*>(.*?)<\/span>/g, "$1");
}

test("normalizeFigure assigns quality to number, zero, absent, and partial input", () => {
  assert.deepEqual(normalizeFigure(256, "GB"), { value: 256, unit: "GB", status: "ok" });
  assert.deepEqual(normalizeFigure(0, "GB"), { value: 0, unit: "GB", status: "zero" });
  assert.deepEqual(normalizeFigure(undefined, "GB"), { value: null, unit: "GB", status: "absent" });
  assert.deepEqual(normalizeFigure({ value: 7, status: "partial", reason: "2 nodes unreachable" }, "GB"), {
    value: 7,
    unit: "GB",
    status: "partial",
    reason: "2 nodes unreachable"
  });
});

test("defaultRenderFigure reports absent data without inventing a value", () => {
  const html = defaultRenderFigure(normalizeFigure(undefined, "GB"));

  assert.match(html, /data-status="absent"/);
  assert.match(html, />no data<\/span>/);
  assert.doesNotMatch(html, /1/);
});

test("renderTopology renders no data for a README node without resources", () => {
  const html = renderTopology({
    name: "cb-demo",
    resources: { memory: "128", cpus: "8" },
    serverGroups: [{
      name: "serverGroup1",
      nodes: [{ name: "cb-demo0001", services: ["Data", "Query", "Index"] }]
    }]
  });

  assert.match(html, /no data/);
  assert.doesNotMatch(html, /1 GB/);
});

test("renderTopology sends every printed figure through renderFigure", () => {
  const figures = [];
  const html = renderTopology(topologyWithEveryFigure, {
    renderFigure(figure) {
      figures.push(figure);
      return "<b>X</b>";
    }
  });

  assert.equal(figures.length, 10);
  assert.equal((html.match(/<b>X<\/b>/g) || []).length, figures.length);
});

test("default figures preserve the 1.1.1 plain-number markup", () => {
  const expected = fs.readFileSync(path.join(__dirname, "fixtures", "plain-number-render.html"), "utf8").trim();
  const actual = removeFigureWrappers(renderTopology(plainNumberTopology)).trim();

  assert.equal(actual, expected);
});
