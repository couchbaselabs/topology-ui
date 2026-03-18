"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  create_cluster,
  mountTopology,
  parseTopologySource,
  renderTopology,
  renderTopologyBlock,
  render_cluster_html
} = require("../index");

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
