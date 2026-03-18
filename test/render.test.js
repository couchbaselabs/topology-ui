"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  create_cluster,
  mountTopology,
  parseTopologySource,
  renderTopology,
  renderTopologyBlock,
  render_cluster_html
} = require("../index");

const scopedCss = fs.readFileSync(path.join(__dirname, "..", "dist", "topology-ui.css"), "utf8");

test("parseTopologySource accepts object literal markdown payloads", () => {
  const topology = parseTopologySource(`
    {
      name: "cb-demo",
      version: "6.6.3",
      serverGroups: [
        {
          name: "serverGroup1",
          nodes: [
            {
              name: "cb-demo0000",
              services: ["Data", "Query", "Index"],
              status: "HEALTHY"
            }
          ]
        }
      ]
    }
  `);

  assert.equal(topology.name, "cb-demo");
  assert.equal(topology.serverGroups[0].nodes[0].services[1], "Query");
});

test("renderTopology preserves the original renderer markup", () => {
  const html = renderTopology({
    name: "cb-demo",
    version: "6.6.3",
    status: "HEALTHY",
    resources: { memory: "128", cpus: "8" },
    serverGroups: [
      {
        name: "serverGroup1",
        nodes: [
          {
            name: "cb-demo0000",
            services: ["Data", "Query", "Index"],
            status: "HEALTHY"
          }
        ]
      }
    ]
  });

  assert.match(html, /class="cb-topology-renderer"/);
  assert.match(html, /class="cb-topology-renderer"><div class="flex flex-col justify-content-center">/);
  assert.match(html, /border-red-700/);
  assert.match(html, /cb \.\.\. 0000/);
  assert.match(html, /images\/nodebg\.png/);
  assert.doesNotMatch(html, /<style/);
});

test("renderTopologyBlock is the same HTML renderer output", () => {
  const html = renderTopologyBlock(`{
    name: "cb-demo",
    serverGroups: [{ name: "sg1", nodes: [{ name: "node1", services: ["Data"] }] }]
  }`);

  assert.doesNotMatch(html, /<style/);
  assert.match(html, /node1/);
});

test("mountTopology updates container HTML with the original renderer", () => {
  const container = { innerHTML: "" };

  mountTopology(container, {
    name: "cb-demo",
    serverGroups: [{ name: "sg1", nodes: [{ name: "node1", services: ["Data"] }] }]
  });
  mountTopology(container, {
    name: "cb-demo-2",
    serverGroups: [{ name: "sg1", nodes: [{ name: "node2", services: ["Query"] }] }]
  });

  assert.match(container.innerHTML, /cb-demo-2/);
  assert.match(container.innerHTML, /node2/);
  assert.match(container.innerHTML, /class="cb-topology-renderer"/);
});

test("legacy create_cluster export remains available", () => {
  const container = { innerHTML: "" };
  create_cluster(container, {
    name: "cb-demo",
    serverGroups: [{ name: "sg1", nodes: [{ name: "node1", services: ["Data"] }] }]
  });

  assert.match(container.innerHTML, /cb-demo/);
});

test("render_cluster_html supports overriding the asset root", () => {
  const html = render_cluster_html({
    name: "cb-demo",
    serverGroups: [{ name: "sg1", nodes: [{ name: "node1", services: ["Data"] }] }]
  }, {
    assetRoot: "/static/topology-ui/images"
  });

  assert.match(html, /\/static\/topology-ui\/images\/nodebg\.png/);
});

test("distributed stylesheet is scoped to the topology root", () => {
  assert.match(scopedCss, /\.cb-topology-renderer\{line-height:1\.5/);
  assert.match(scopedCss, /\.cb-topology-renderer \*,\.cb-topology-renderer :after,\.cb-topology-renderer :before\{/);
  assert.match(scopedCss, /\.cb-topology-renderer \.flex\{display:flex/);
  assert.match(scopedCss, /\.cb-topology-renderer \.fa,/);
  assert.doesNotMatch(scopedCss, /(^|})html\{/);
  assert.doesNotMatch(scopedCss, /(^|})body\{/);
});

test("renderTopology renders buckets without requiring serverGroups", () => {
  const html = renderTopology({
    buckets: [
      {
        name: "bucket-only",
        quota: 1024,
        documents: 5000,
        ratio: 75,
        replicas: 1,
        connectors: ["mobile"]
      }
    ]
  });

  assert.match(html, /bucket-only/);
  assert.match(html, /connector-mobile\.svg/);
  assert.doesNotMatch(html, /undefined/);
});

test("renderTopology renders mobile without requiring cluster data", () => {
  const html = renderTopology({
    mobile: {
      version: "3.1.0",
      publicAddress: "https://mobile.example.com",
      groups: [
        {
          name: "Group 1",
          instances: [
            {
              nodeIp: "10.0.0.10",
              name: "SG 1"
            }
          ]
        }
      ],
      databases: [{ name: "db1" }]
    }
  });

  assert.match(html, /https:\/\/mobile\.example\.com/);
  assert.match(html, /SG 1/);
  assert.match(html, /db1/);
  assert.doesNotMatch(html, /TypeError/);
});

test("render output keeps the original layout structure inside the wrapper", () => {
  const html = renderTopology({
    name: "cb-demo",
    version: "6.6.3",
    resources: { memory: "128", cpus: "8" },
    serverGroups: [
      {
        name: "serverGroup1",
        nodes: [{ name: "cb-demo0000", services: ["Data", "Query", "Index"] }]
      }
    ],
    buckets: [
      {
        name: "mybucket",
        quota: 1024,
        documents: 5000,
        ratio: 75,
        replicas: 1
      }
    ]
  });

  assert.match(html, /class="cb-topology-renderer"><div class="flex flex-col justify-content-center">/);
  assert.match(html, /class="m-4 inline-block flex-row border-4 rounded-xl border-red-700/);
  assert.match(html, /class="grid grid-cols-1 shadow-sm m-4/);
});
