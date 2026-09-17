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
  assert.match(html, />&#8212;<\/span>/);
});

test("defaultRenderFigure marks partial values without changing their value or unit", () => {
  const html = defaultRenderFigure({ value: 64, unit: "GB", status: "partial", reason: "one source missing" });

  assert.match(html, /data-status="partial"/);
  assert.match(html, />~64 GB<\/span>/);
  assert.doesNotMatch(html, /style=/);
});

test("defaultRenderFigure uses the same placeholder when collection failed without a value", () => {
  const html = defaultRenderFigure({ value: null, unit: "%", status: "failed", reason: "Supportal failed" });

  assert.match(html, /data-status="failed"/);
  assert.match(html, />&#8212;<\/span>/);
});

test("renderTopology renders a placeholder for a README node without resources", () => {
  const html = renderTopology({
    name: "cb-demo",
    resources: { memory: "128", cpus: "8" },
    serverGroups: [{
      name: "serverGroup1",
      nodes: [{ name: "cb-demo0001", services: ["Data", "Query", "Index"] }]
    }]
  });

  assert.match(html, />&#8212;<\/span>/);
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

test("bucket summary aggregates object figures as partial quality figures", () => {
  const figures = [];
  const html = renderTopology({
    buckets: [
      {
        name: "one",
        quota: { value: 1024, status: "partial", reason: "one node stale" },
        documents: { value: 1000, status: "ok" }
      },
      {
        name: "two",
        quota: { value: 2048, status: "ok" },
        documents: { value: 2000, status: "stale", reason: "old metrics" }
      }
    ]
  }, {
    renderFigure(figure) {
      figures.push(figure);
      return "<b>X</b>";
    }
  });

  assert.doesNotMatch(html, /\[object Object\]/);
  const summaryFigures = figures.filter((figure) => figure.value === 3);
  assert.deepEqual(summaryFigures, [
    { value: 3, unit: "GB", status: "partial", reason: "summary includes incomplete bucket data" },
    { value: 3, unit: "K", status: "partial", reason: "summary includes incomplete bucket data" }
  ]);
});

test("bucket figures preserve explicit units", () => {
  const html = renderTopology({
    buckets: [{
      name: "bucket",
      quota: { value: 7, unit: "GiB", status: "partial", reason: "one source missing" },
      documents: { value: 2, unit: "M", status: "partial", reason: "one source missing" }
    }]
  });

  assert.match(html, />~7 GiB<\/span>/);
  assert.match(html, />~2 M<\/span>/);
});

test("bucket summary excludes failed numeric payloads", () => {
  const figures = [];
  renderTopology({
    buckets: [
      { name: "one", quota: { value: 1024, status: "ok" }, documents: 1000 },
      { name: "two", quota: { value: 2048, status: "failed", reason: "collection failed" }, documents: 2000 }
    ]
  }, {
    renderFigure(figure) {
      figures.push(figure);
      return "<b>X</b>";
    }
  });

  assert.deepEqual(figures.filter((figure) => figure.unit === "GB").at(-1), {
    value: 1,
    unit: "GB",
    status: "partial",
    reason: "summary includes incomplete bucket data"
  });
});

test("bucket summary keeps plain-number quota and document figures ok", () => {
  const figures = [];
  renderTopology({
    buckets: [
      { name: "one", quota: 1024, documents: 1000 },
      { name: "two", quota: 2048, documents: 2000 }
    ]
  }, {
    renderFigure(figure) {
      figures.push(figure);
      return "<b>X</b>";
    }
  });

  const summaryFigures = figures.filter((figure) => figure.value === 3);
  assert.deepEqual(summaryFigures, [
    { value: 3, unit: "GB", status: "ok" },
    { value: 3, unit: "K", status: "ok" }
  ]);
});

test("bucket summary keeps all missing quota and documents absent", () => {
  const figures = [];
  renderTopology({
    buckets: [
      { name: "one", quota: { value: null, status: "absent" }, documents: { value: null, status: "absent" } },
      { name: "two", quota: { value: null, status: "absent" }, documents: { value: null, status: "absent" } }
    ]
  }, {
    renderFigure(figure) {
      figures.push(figure);
      return "<b>X</b>";
    }
  });

  assert.deepEqual(figures.slice(-2), [
    { value: null, unit: "MB", status: "absent" },
    { value: null, unit: "", status: "absent" }
  ]);
});

test("bucket summary leaves resident replicas and TTL cells empty", () => {
  const html = renderTopology({
    buckets: [
      { name: "one", quota: 1024, documents: 1000, ratio: 75, replicas: 1, ttl: 3600 },
      { name: "two", quota: 2048, documents: 2000, ratio: 80, replicas: 2, ttl: 7200 }
    ]
  });
  const summary = html.slice(html.lastIndexOf(">Total"));

  assert.equal((summary.match(/class="cb-tu-figure"/g) || []).length, 2);
  assert.doesNotMatch(summary, />\s*0\s*<\/div>/);
});
