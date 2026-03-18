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

const hostileUtilityTokens = [
  "flex",
  "flex-row",
  "flex-col",
  "flex-column",
  "flow-column",
  "flex-wrap",
  "flex-nowrap",
  "justify-content-center",
  "justify-center",
  "align-center",
  "align-left",
  "text-right",
  "text-center",
  "w-full",
  "max-w-100",
  "grid-nowrap",
  "px-6",
  "py-1",
  "px-2",
  "py-2",
  "mx-2",
  "mx-10",
  "mx-8",
  "my-0",
  "my-2",
  "my-4",
  "gap-x-4",
  "gap-y-3",
  "space-x-1",
  "space-y-0"
];

function extractClassTokens(html) {
  const tokens = new Set();

  for (const match of html.matchAll(/\bclass=(["'])(.*?)\1/g)) {
    for (const token of match[2].split(/\s+/).filter(Boolean)) {
      tokens.add(token);
    }
  }

  return tokens;
}

function assertNamespacedRendererClasses(html) {
  const unexpected = [...extractClassTokens(html)]
    .filter((token) => !/^(cb-topology-renderer|cb-tu-[^\s]+|cb-tr-[^\s]+|fa(?:[bdrslt])?|fa-[A-Za-z0-9-]+)$/.test(token))
    .sort();

  assert.deepEqual(unexpected, [], `unexpected non-namespaced renderer classes: ${unexpected.join(", ")}`);
}

function assertNoHostCollisionUtilityTokens(html) {
  const tokens = extractClassTokens(html);
  const collisions = hostileUtilityTokens.filter((token) => tokens.has(token));

  assert.deepEqual(collisions, [], `host-collision utility classes leaked into output: ${collisions.join(", ")}`);
}

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

test("renderTopology emits namespaced host-safe markup", () => {
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
  assert.match(html, /class="cb-topology-renderer"><div class="cb-tu-flex cb-tu-flex-col cb-tu-justify-content-center">/);
  assert.match(html, /cb-tu-border-red-700/);
  assert.match(html, /cb \.\.\. 0000/);
  assert.match(html, /images\/nodebg\.png/);
  assert.doesNotMatch(html, /<style/);
  assertNamespacedRendererClasses(html);
  assertNoHostCollisionUtilityTokens(html);
});

test("renderTopologyBlock keeps the same host-safe renderer output shape", () => {
  const html = renderTopologyBlock(`{
    name: "cb-demo",
    serverGroups: [{ name: "sg1", nodes: [{ name: "node1", services: ["Data"] }] }]
  }`);

  assert.doesNotMatch(html, /<style/);
  assert.match(html, /node1/);
  assert.match(html, /cb-tu-flex/);
  assertNamespacedRendererClasses(html);
  assertNoHostCollisionUtilityTokens(html);
});

test("mountTopology updates container HTML with the host-safe renderer", () => {
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
  assertNamespacedRendererClasses(container.innerHTML);
  assertNoHostCollisionUtilityTokens(container.innerHTML);
});

test("legacy create_cluster export remains available", () => {
  const container = { innerHTML: "" };
  create_cluster(container, {
    name: "cb-demo",
    serverGroups: [{ name: "sg1", nodes: [{ name: "node1", services: ["Data"] }] }]
  });

  assert.match(container.innerHTML, /cb-demo/);
  assertNamespacedRendererClasses(container.innerHTML);
});

test("render_cluster_html supports overriding the asset root", () => {
  const html = render_cluster_html({
    name: "cb-demo",
    serverGroups: [{ name: "sg1", nodes: [{ name: "node1", services: ["Data"] }] }]
  }, {
    assetRoot: "/static/topology-ui/images"
  });

  assert.match(html, /\/static\/topology-ui\/images\/nodebg\.png/);
  assertNamespacedRendererClasses(html);
});

test("distributed stylesheet is scoped and uses prefixed renderer classes", () => {
  assert.match(scopedCss, /\.cb-topology-renderer\{line-height:1\.5/);
  assert.match(scopedCss, /\.cb-topology-renderer \*,\.cb-topology-renderer :after,\.cb-topology-renderer :before\{/);
  assert.match(scopedCss, /\.cb-topology-renderer \.cb-tu-flex\{/);
  assert.match(scopedCss, /\.cb-topology-renderer \.cb-tu-px-6\{[^}]*padding-left:1\.5rem;[^}]*padding-right:1\.5rem;?/s);
  assert.match(scopedCss, /\.cb-topology-renderer \.cb-tu-py-1\{[^}]*padding-top:\.25rem;[^}]*padding-bottom:\.25rem;?/s);
  assert.match(scopedCss, /\.cb-topology-renderer \.cb-tu-text-right\{[^}]*text-align:right/s);
  assert.match(scopedCss, /\.cb-topology-renderer \.cb-tr-mobile-database-pill\{[^}]*display:\s*inline-flex;[^}]*width:\s*auto;/s);
  assert.match(scopedCss, /\.cb-topology-renderer \.cb-tr-mobile-network-pill\{[^}]*z-index:\s*20;[^}]*display:\s*inline-flex;/s);
  assert.match(scopedCss, /\.cb-topology-renderer \.fa,/);
  assert.doesNotMatch(scopedCss, /\.npm\\ cb-tu-/);
  assert.doesNotMatch(scopedCss, /\.cb-topology-renderer \.flex\{/);
  assert.doesNotMatch(scopedCss, /\.cb-topology-renderer \.px-6\{/);
  assert.doesNotMatch(scopedCss, /\.cb-topology-renderer \.py-1\{/);
  assert.doesNotMatch(scopedCss, /\.cb-topology-renderer \.text-right\{/);
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
  assert.match(html, /cb-tu-grid cb-tu-grid-cols-1 cb-tu-shadow-sm cb-tu-m-4/);
  assert.doesNotMatch(html, /undefined/);
  assertNamespacedRendererClasses(html);
});

test("renderTopology renders mobile with host-safe load balancer and database blocks", () => {
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
  assert.match(html, /cb-tr-mobile-network-address/);
  assert.match(html, /cb-tr-mobile-network-line/);
  assert.match(html, /cb-tr-mobile-network-pill/);
  assert.match(html, /cb-tr-mobile-databases-card/);
  assert.match(html, /cb-tr-mobile-database-pill/);
  assert.ok(html.indexOf("cb-tr-mobile-network-address") < html.indexOf("cb-tr-mobile-network-pill"));
  assert.doesNotMatch(html, /<table/i);
  assert.doesNotMatch(html, /TypeError/);
  assertNamespacedRendererClasses(html);
  assertNoHostCollisionUtilityTokens(html);
});

test("hostile host fixture selectors do not target renderer utility classes or tables", () => {
  const hostileCss = `
    .layout .flex { padding: 12px; }
    .v-application .px-6 { padding-left: 24px !important; padding-right: 24px !important; }
    .v-application .py-1 { padding-top: 4px !important; padding-bottom: 4px !important; }
    .v-main .contents table { border: 1px solid #ddd; width: 100%; background: white; }
    .v-main .contents table th { background: #f5f5f5; border-bottom: 2px solid #999; }
    .v-main .contents table tr td:nth-child(even) { background: #fafafa; }
  `;

  const html = renderTopology({
    name: "cb-demo",
    version: "6.6.3",
    serverGroups: [
      {
        name: "serverGroup1",
        nodes: [{ name: "node1", services: ["Data", "Query"] }]
      }
    ],
    buckets: [
      {
        name: "bucket-only",
        quota: 1024,
        documents: 5000,
        ratio: 75,
        replicas: 1,
        connectors: ["mobile"]
      }
    ],
    mobile: {
      version: "3.1.0",
      publicAddress: "https://mobile.example.com",
      groups: [
        {
          name: "Group 1",
          instances: [{ nodeIp: "10.0.0.10", name: "SG 1" }]
        }
      ],
      databases: [{ name: "db1" }]
    }
  });

  const fixture = `
    <style>${hostileCss}</style>
    <div class="v-application">
      <div class="layout">
        <div class="v-main">
          <div class="contents">
            ${html}
          </div>
        </div>
      </div>
    </div>
  `;

  assert.match(fixture, /\.layout \.flex \{ padding: 12px; \}/);
  assert.match(fixture, /class="cb-topology-renderer"/);
  assert.match(fixture, /cb-tr-mobile-network-pill/);
  assert.match(fixture, /cb-tr-mobile-database-pill/);
  assertNamespacedRendererClasses(html);
  assertNoHostCollisionUtilityTokens(html);
  assert.doesNotMatch(html, /<table/i);
});
