# 9 Nodes distributed accross 3 Server Group And non homogenous cpu/memory resources

![Server Groups Sample](../assets/3sg-cluster-sample.png)


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
                    resources: {
                        memory: "256",
                        cpus: "16"
                    },
                    services: [
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
                        "Index",
                        "Analytics"
                    ],
                    status: "HEALTHY"
                },
                {
                    name: "cb-demo0002",
                    services: [
                        "Data",
                        "Query",
                        "Index",
                        "Analytics"
                    ],
                    status: "HEALTHY"
                }
            ],
            status: "HEALTHY"
        },
        {
            name: "serverGroup2",
            nodes: [
                {
                    name: "cb-demo0003",
                    resources: {
                        memory: "256",
                        cpus: "16"
                    },
                    services: [
                        "Data",
                        "Query",
                        "Index",
                        "Analytics"
                    ],
                    status: "HEALTHY"
                },
                {
                    name: "cb-demo0004",
                    services: [
                        "Data",
                        "Query",
                        "Index",
                        "Analytics"
                    ],
                    status: "HEALTHY"
                },
                {
                    name: "cb-demo0005",
                    services: [
                        "Data",
                        "Query",
                        "Index",
                        "Analytics"
                    ],
                    status: "HEALTHY"
                }
            ],
            status: "HEALTHY"
        },
        {
            name: "serverGroup3",
            nodes: [
                {
                    name: "cb-demo0006",
                    services: [
                        "Data"
                    ],
                    status: "HEALTHY"
                },
                {
                    name: "cb-demo0007",
                    services: [
                        "Data",
                    ],
                    status: "HEALTHY"
                },
                {
                    name: "cb-demo0008",
                    services: [
                        "Query",
                        "Index"
                    ],
                    resources: {
                        memory: "256",
                        cpus: "16"
                    },
                    status: "HEALTHY"
                }
            ],
            status: "HEALTHY"
        }
    ],
    buckets: [{
        name: "mybucket",
        quota: 5590,
        documents: 39000000,
        ratio: 49,
        "replicas": 1,
        "connectors": ["mobile", "kafka", "elastic"]
    },
        {
            name: "mybucket2",
            quota: 5590,
            documents: 39000000,
            ratio: 49,
            "replicas": 1,
            "connectors": ["mobile", "kafka", "elastic"]
        },
        {
            name: "mybucket3",
            quota: 5590,
            documents: 39000000,
            ratio: 49,
            "replicas": 1,
            "connectors": ["mobile", "kafka", "elastic"]
        }],
    status: "HEALTHY"
};

```
