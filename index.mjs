let topologyUi;

if (typeof window !== "undefined") {
  await import("./js/couchbase-info.js");
  topologyUi = window.couchbaseTopologyUi;
} else {
  const nodeModule = await import("./index.js");
  topologyUi = nodeModule.default || nodeModule;
}

export const {
  create_cluster,
  createCluster,
  get_asset_root,
  getAssetRoot,
  mountTopology,
  parseTopologySource,
  render_cluster_html,
  renderClusterHtml,
  renderTopology,
  renderTopologyBlock,
  set_asset_root,
  setAssetRoot
} = topologyUi;

export default topologyUi;
