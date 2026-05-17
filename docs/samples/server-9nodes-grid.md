# 9 Nodes capped at 2 per line via `nodesPerLine`

Demonstrates the cluster-level `nodesPerLine` field. With three server groups of three nodes each and `nodesPerLine: 2`, each group renders a row of 2 followed by a row of 1.

```javascript
let data = {
    name: "cb-demo",
    version: "6.6.3",
    resources: {
        memory: "128",
        cpus: "8"
    },
    nodesPerLine: 2,
    serverGroups: [
        {
            name: "serverGroup1",
            nodes: [
                { name: "cb-demo0000", services: ["Data", "Query", "Index"], status: "HEALTHY" },
                { name: "cb-demo0001", services: ["Data", "Query", "Index"], status: "HEALTHY" },
                { name: "cb-demo0002", services: ["Data", "Query", "Index"], status: "HEALTHY" }
            ],
            status: "HEALTHY"
        },
        {
            name: "serverGroup2",
            nodes: [
                { name: "cb-demo0003", services: ["Data", "Query", "Index"], status: "HEALTHY" },
                { name: "cb-demo0004", services: ["Data", "Query", "Index"], status: "HEALTHY" },
                { name: "cb-demo0005", services: ["Data", "Query", "Index"], status: "HEALTHY" }
            ],
            status: "HEALTHY"
        },
        {
            name: "serverGroup3",
            nodes: [
                { name: "cb-demo0006", services: ["Data", "Query", "Index"], status: "HEALTHY" },
                { name: "cb-demo0007", services: ["Data", "Query", "Index"], status: "HEALTHY" },
                { name: "cb-demo0008", services: ["Data", "Query", "Index"], status: "HEALTHY" }
            ],
            status: "HEALTHY"
        }
    ],
    status: "HEALTHY"
};
```
