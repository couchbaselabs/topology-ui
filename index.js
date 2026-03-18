"use strict";

const { parseTopologySource } = require("./lib/parser");
const browserRenderer = require("./js/couchbase-info.js");

function normalizeTopologyInput(input, options) {
  if (typeof input === "string" || (typeof Buffer !== "undefined" && Buffer.isBuffer(input))) {
    return parseTopologySource(input, options);
  }

  return input;
}

function renderTopology(input, options = {}) {
  const topology = normalizeTopologyInput(input, options);
  return browserRenderer.render_cluster_html(topology, options);
}

function renderTopologyBlock(input, options = {}) {
  return renderTopology(input, options);
}

function mountTopology(container, input, options = {}) {
  const topology = normalizeTopologyInput(input, options);
  return browserRenderer.create_cluster(container, topology, options);
}

module.exports = {
  ...browserRenderer,
  mountTopology,
  parseTopologySource,
  renderTopology,
  renderTopologyBlock
};
