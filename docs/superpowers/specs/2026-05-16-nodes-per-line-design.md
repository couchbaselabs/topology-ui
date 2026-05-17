# Design: `nodesPerLine` cluster field

## Summary

Add an optional cluster-level field `nodesPerLine` (positive integer) to the topology input. When set, each server group renders its nodes in rows capped at that many nodes per row, instead of the current container-width-driven `flex-wrap` behavior. When omitted or invalid, behavior is unchanged.

## Motivation

Currently `create_server_group_nodes` (`js/couchbase-info.js:292`) wraps the node list with `flex flex-wrap`. With many nodes, they all flow onto one very wide line until the container runs out of width. Users want explicit control: e.g. 9 nodes with `nodesPerLine: 3` → 3 rows of 3; with `nodesPerLine: 2` → 4 rows of 2 + 1.

## Schema

Top-level cluster field:

```js
{
    name: "cb-demo",
    version: "6.6.3",
    resources: { memory: "128", cpus: "8" },
    nodesPerLine: 3,              // <-- new, optional
    serverGroups: [ ... ]
}
```

**Validation:** value must be `Number.isInteger(v) && v >= 1`. Anything else (missing, `0`, negative, non-integer, non-number) falls back to current `flex-wrap` rendering.

**Scope of the cap:** applies *inside each server group independently*. Server-group dashed-border boxes already segment nodes visually (`js/couchbase-info.js:303`); the cap operates within that segmentation. Example with 3 groups of 3 nodes and `nodesPerLine: 2`:

- Group 1 → row of 2, row of 1
- Group 2 → row of 2, row of 1
- Group 3 → row of 2, row of 1

## Rendering

### Affected function

`create_server_group_nodes(sgNodes)` at `js/couchbase-info.js:292-297`.

### New behavior

When `nodesPerLine` is set and valid:
- Chunk `sgNodes` into consecutive slices of size `n`.
- Emit one `<div class="flex flex-row">` per chunk; each chunk shrinks to the natural total width of its nodes.
- Wrap chunks in an outer `<div class="my-2 flex flex-col">` so rows stack vertically.

When not set, keep the existing `<div class="my-2 flex flex-wrap">` single-row wrapper exactly as today (no behavior change for existing inputs).

### Why manual chunking (not CSS grid / flex-basis)

Couchbase node tiles have varying intrinsic widths (stack indicator `total ≥ 2`, services list length, name). CSS grid columns would stretch nodes to equal widths and force the outer red wrapper to span container width; `flex-basis: calc(100%/N)` requires a fixed parent width and stretches nodes. Manual chunking preserves natural node sizing, and the outer wrapper continues to hug its widest row — matching the current visual where the red border sits tight against the nodes.

Additionally, Tailwind cannot generate arbitrary `grid-cols-${N}` classes without a safelist; manual chunking avoids that constraint.

### Pseudocode

```js
function create_server_group_nodes(sgNodes, nodesPerLine) {
    if (!sgNodes) return "<div class=\"my-2 flex flex-wrap\"></div>";

    const n = Number.isInteger(nodesPerLine) && nodesPerLine >= 1 ? nodesPerLine : 0;

    if (!n) {
        let nodes = "";
        sgNodes.forEach(node => nodes += create_node(node));
        return "<div class=\"my-2 flex flex-wrap\">" + nodes + "</div>";
    }

    let rows = "";
    for (let i = 0; i < sgNodes.length; i += n) {
        let row = "";
        sgNodes.slice(i, i + n).forEach(node => row += create_node(node));
        rows += "<div class=\"flex flex-row\">" + row + "</div>";
    }
    return "<div class=\"my-2 flex flex-col\">" + rows + "</div>";
}
```

## Plumbing

`nodesPerLine` is read from `data` (the cluster root) and threaded down through the existing call chain:

- `create_server_topology(data)` — `js/couchbase-info.js:807` — read `data.nodesPerLine`, pass to `create_server_groups`.
- `create_server_groups(serverGroups, nodesPerLine)` — `js/couchbase-info.js:314` — forward to each `create_server_group`.
- `create_server_group(sg, groupsVisible, position, nodesPerLine)` — `js/couchbase-info.js:299` — forward to `create_server_group_nodes`.
- `create_server_group_nodes(sgNodes, nodesPerLine)` — applies the cap.

No new module boundaries; signatures grow by one parameter.

## Edge cases

| Case | Behavior |
|------|----------|
| `nodesPerLine` omitted / undefined | Current `flex-wrap` behavior (no change). |
| `nodesPerLine: 0` / negative / non-integer / string | Treated as invalid → fallback to `flex-wrap`. |
| `nodesPerLine` larger than group size | Single row containing all nodes (visually same as today for that group). |
| Group with empty `nodes` array | Empty `flex-col` wrapper (matches current empty-wrap behavior). |
| Last row partial (e.g. 9 nodes, `nodesPerLine: 2` → final row has 1) | Renders naturally, left-aligned within the group. |
| Mixed group sizes (e.g. one group with 5 nodes, one with 2, cap 3) | Each group chunks independently: 3+2, then 2. |

## Testing

- Add `docs/samples/server-9nodes-grid.md` with the existing 9-node sample plus `nodesPerLine: 3` to demonstrate 3×3 layout.
- Add a sample exercising the uneven case: `nodesPerLine: 2` over 9 nodes (4 rows of 2 + 1 row of 1) — could be inline in the same sample or separate.
- Manual visual verification using `index.html`: confirm the red cluster border still hugs the widest row, server-group dashed boxes still segment correctly, and stacked-node indicators (`total ≥ 2`) still align.
- Regression check: render an existing sample with no `nodesPerLine` and confirm pixel-identical output to current behavior.

## Out of scope

- Per-server-group override (`nodesPerLine` only at cluster root).
- Nested layout object (`layout: { nodesPerLine }`) — flat field for now; can be promoted later if more layout knobs land.
- Cap that ignores server-group boundaries.
- Responsive / breakpoint-based caps.
