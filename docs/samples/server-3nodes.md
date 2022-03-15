# 3 Nodes with Data, Query and Index Services with homogenous cpu/memory resources

![Server Groups Sample](../assets/simpleTopology.png)

```javascript
    let data = {
        name: "cb-demo",
            version: "6.6.3",
        resources: {
        memory: "128",
            cpus: "8"
    },
        serverGroups: [
            {
                name: "serverGroup1",
                nodes: [
                    {
                        name: "cb-demo0000",
                        services: [
                            "Data",
                            "Query",
                            "Index"
                        ],
                        status: "HEALTHY"
                    },
                    {
                        name: "cb-demo0001",
                        services: [
                            "Data",
                            "Query",
                            "Index"
                        ],
                        status: "HEALTHY"
                    },
                    {
                        name: "cb-demo0002",
                        services: [
                            "Data",
                            "Query",
                            "Index"
                        ],
                        status: "HEALTHY"
                    }
                ],
                status: "HEALTHY"
            }
        ],
            buckets: [{ name: "mybucket", quota: 5590, documents: 39000000, ratio: 49, connectors: ["mobile","kafka", "elastic"]},
        { name: "mybucket2", quota: 5590, documents: 39000000, ratio: 49, connectors: ["mobile","kafka", "elastic"]},
        { name: "mybucket3", quota: 5590, documents: 39000000, ratio: 49, connectors: ["mobile","kafka", "elastic"]}],
        status: "HEALTHY"
    }
```
